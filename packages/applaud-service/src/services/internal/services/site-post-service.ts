import * as yup from "yup";
import moment from "moment";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { ensureAdmin } from "../../auth/helpers";
import SitePost from "../db/models/site-post";
import {
  executeSelectAll,
  executeSelectCount,
  executeSelectFirst,
  handlePagination
} from "../helpers";
import { AppContext } from "../../auth/app-context";
import { SiteService } from "./site-service";

export type SitePostSort = "ID_ASC" | "ID_DESC";

export interface SitePostOptions extends PaginationArgs<SitePostSort> {
  siteIds?: string[];
  search?: string;
  statusIds?: string[];
}

export interface CreateSitePostInput {
  siteId?: string;
  title: string;
  content: string;
}

export interface UpdateSitePostInput {
  title?: string;
  content?: string;
}

export class SitePostService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<SitePost> {
    ensureAdmin(this.context.viewer);
    const query = SitePost.query();

    // TODO: do we want to include deleted post
    query.whereNull("deletedAt");

    return {
      query
    };
  }

  async getById(id: number): Promise<SitePost | null> {
    const { query } = this.initializeAuthorizedQuery();
    const sitePost = await query.findById(id);
    return sitePost || null;
  }

  private getAllQuery(options: SitePostOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`${SitePost.tableName}.title`, "like", `%${options.search}%`);
    }

    if (options.siteIds && options.siteIds.length > 0) {
      query.whereIn(`${SitePost.tableName}.siteId`, options.siteIds);
    }

    if (options.statusIds && options.statusIds.length > 0) {
      query.whereIn(
        `${SitePost.tableName}.siteId`,
        new SiteService(this.context)
          .getAllQuery({
            deployStatuses: options.statusIds
          })
          .select("id")
      );
    }

    switch (options.sort) {
      case "ID_ASC":
        query.orderBy(`${SitePost.tableName}.id`, "asc");
        break;
      case "ID_DESC":
        query.orderBy(`${SitePost.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${SitePost.tableName}.id`, "desc");
        break;
    }

    return query;
  }

  async getFirst(options: SitePostOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: SitePostOptions): Promise<number> {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: SitePostOptions): Promise<SitePost[]> {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateSitePostInput): Promise<SitePost> {
    // Validation
    const schema = yup.object().shape({
      siteId: yup
        .string()
        .label("Site ID")
        .notRequired()
        .nullable(true),
      title: yup
        .string()
        .label("Title")
        .required()
        .nullable(false),
      content: yup
        .string()
        .label("Content")
        .required()
        .nullable(false)
    });

    // TODO: Do we want to validate site id exist - or db referential integrity suffice
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateSitePostInput;

    const viewer = ensureAdmin(this.context.viewer);

    const sitePost = await SitePost.query().insertAndFetch({
      siteId: validatedInput.siteId,
      title: validatedInput.title,
      content: validatedInput.content,
      addedByUserId: viewer.userId,
      createdAt: moment.utc().toDate()
    });

    return sitePost;
  }

  async update(
    sitePostId: number,
    updates: UpdateSitePostInput
  ): Promise<SitePost> {
    // Validation
    const schema = yup.object().shape({
      title: yup
        .string()
        .label("Title")
        .notRequired()
        .nullable(false),
      content: yup
        .string()
        .label("Content")
        .notRequired()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateSitePostInput;

    const updatedSitePost = await SitePost.query().patchAndFetchById(
      sitePostId,
      {
        lastUpdatedAt: moment.utc().toDate(),
        ...validatedUpdates
      }
    );
    return updatedSitePost;
  }

  async delete(sitePostId: number): Promise<void> {
    const sitePost = await this.getById(sitePostId);

    if (!sitePost) {
      throw new Error("Invalid Site Post ID specified.");
    }

    await SitePost.query().patchAndFetchById(sitePostId, {
      deletedAt: moment.utc().toDate()
    });
  }
}
