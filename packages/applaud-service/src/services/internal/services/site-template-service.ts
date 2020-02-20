import * as yup from "yup";
import moment from "moment";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureAdmin } from "../../auth/helpers";
import SiteTemplate from "../db/models/site-template";
import { AppContext } from "../../auth/app-context";

export interface CreateSiteTemplateInput {
  name: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class SiteTemplateService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<SiteTemplate> {
    ensureAdmin(this.context.viewer);

    const query = SiteTemplate.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const siteTemplate = await query.findById(id);
    return siteTemplate || null;
  }

  private getAllQuery(options: PaginationArgs) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${SiteTemplate.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${SiteTemplate.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${SiteTemplate.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: PaginationArgs) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: PaginationArgs) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: PaginationArgs) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateSiteTemplateInput) {
    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Site Template Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateSiteTemplateInput;

    const siteTemplate = await SiteTemplate.query().insertAndFetch({
      name: validatedInput.name,
      createdAt: moment.utc().toDate()
    });

    return siteTemplate;
  }
}
