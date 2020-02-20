import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureAdmin } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";
import Site from "../db/models/site";
import { DomainService } from "./domain-service";

export interface SiteOptions extends PaginationArgs {
  search?: string;
  deployStatuses?: string[];
}

export interface CreateSiteInput {
  id: string;
  categoryId?: number | null;
  siteTemplateId?: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class SiteService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Site> {
    ensureAdmin(this.context.viewer);
    const query = Site.query();

    return {
      query
    };
  }

  async getById(id: string) {
    const { query } = this.initializeAuthorizedQuery();
    const site = await query.findById(id);
    return site || null;
  }

  getAllQuery(options: SiteOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`${Site.tableName}.id`, "like", `%${options.search}%`);
    }

    if (options.deployStatuses && options.deployStatuses.length > 0) {
      query.whereIn(`${Site.tableName}.deployStatus`, options.deployStatuses);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Site.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Site.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Site.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: SiteOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: SiteOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: SiteOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateSiteInput) {
    // Validation
    const schema = yup.object().shape({
      id: yup
        .string()
        .label("ID")
        .required()
        .nullable(false),
      categoryId: yup
        .number()
        .label("Category ID")
        .notRequired()
        .nullable(true),
      siteTemplateId: yup
        .number()
        .label("Site Template ID")
        .notRequired()
        .nullable(true)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateSiteInput;

    const existingSite = await this.getById(validatedInput.id);

    if (existingSite) {
      return existingSite;
    }

    const domainService = new DomainService(this.context);

    const domain = await domainService.getById(validatedInput.id);

    if (domain && domain.registrar && domain.registrarId) {
      const site = await Site.query().insertAndFetch({
        id: validatedInput.id,
        categoryId: validatedInput.categoryId,
        siteTemplateId: validatedInput.siteTemplateId
      });

      return site;
    } else {
      throw new Error("Domain is not purchased");
    }
  }
}
