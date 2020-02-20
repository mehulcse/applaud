import moment from "moment";
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
import DomainCategory from "../db/models/domain-category";
import { AppContext } from "../../auth/app-context";

export interface DomainCategoryOptions extends PaginationArgs {
  domainIds?: string[];
  categoryIds?: number[];
}

export interface CreateDomainCategoryInput {
  domainId: string;
  categoryId: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class DomainCategoryService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<DomainCategory> {
    ensureAdmin(this.context.viewer);

    const query = DomainCategory.query();

    // Filter out "deleted" Domain categories
    query.whereNull("deletedAt");

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const domainCategory = await query.findById(id);
    return domainCategory || null;
  }

  getAllQuery(options: DomainCategoryOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.domainIds && options.domainIds.length > 0) {
      query.whereIn("domainId", options.domainIds);
    }

    if (options.categoryIds && options.categoryIds.length > 0) {
      query.whereIn("categoryId", options.categoryIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${DomainCategory.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${DomainCategory.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${DomainCategory.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: DomainCategoryOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: DomainCategoryOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: DomainCategoryOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateDomainCategoryInput) {
    ensureAdmin(this.context.viewer);

    const existingDomainCategory = await this.getFirst({
      domainIds: [input.domainId],
      categoryIds: [input.categoryId]
    });

    if (existingDomainCategory) {
      throw new Error("Domain Category already exists.");
    }

    // Validation
    const schema = yup.object().shape({
      domainId: yup
        .string()
        .label("Domain ID")
        .min(1)
        .max(255)
        .required()
        .nullable(false),
      categoryId: yup
        .number()
        .label("Category ID")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateDomainCategoryInput;

    const domainCategory = await DomainCategory.query().insertAndFetch({
      domainId: validatedInput.domainId,
      categoryId: validatedInput.categoryId
    });

    return domainCategory;
  }

  async delete(domainCategoryId: number) {
    ensureAdmin(this.context.viewer);
    const domainCategory = await this.getById(domainCategoryId);

    if (!domainCategory) {
      throw new Error("Invalid Domain Category ID specified.");
    }
    await DomainCategory.query().patchAndFetchById(domainCategoryId, {
      deletedAt: moment.utc().toDate()
    });
  }
}
