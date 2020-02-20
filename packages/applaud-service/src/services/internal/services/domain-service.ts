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
import Domain from "../db/models/domain";
import { AppContext } from "../../auth/app-context";
import { DomainCategoryService } from "./domain-category-service";

export interface DomainOptions extends PaginationArgs {
  search?: string;
  statusIds?: string[];
  categoryIds?: number[];
}

export interface CreateDomainInput {
  id: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class DomainService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Domain> {
    ensureAdmin(this.context.viewer);

    const query = Domain.query();

    return {
      query
    };
  }

  async getById(id: string) {
    const { query } = this.initializeAuthorizedQuery();
    const domain = await query.findById(id);
    return domain || null;
  }

  private getAllQuery(options: DomainOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`id`, "like", `%${options.search}%`);
    }

    if (options.statusIds && options.statusIds.length > 0) {
      query.whereIn("status", options.statusIds);
    }

    if (options.categoryIds && options.categoryIds.length > 0) {
      query.whereIn(
        "id",
        new DomainCategoryService(this.context)
          .getAllQuery({ categoryIds: options.categoryIds })
          .select("domainId")
      );
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Domain.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Domain.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Domain.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: DomainOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: DomainOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: DomainOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateDomainInput) {
    ensureAdmin(this.context.viewer);

    // Validation
    const schema = yup.object().shape({
      id: yup
        .string()
        .label("Domain Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
        .matches(
          /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
          "Not a valid domain."
        )
        .lowercase()
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateDomainInput;

    const existingDomain = await this.getById(validatedInput.id);
    if (existingDomain) {
      throw new Error("Domain Already exists.");
    }

    const domain = await Domain.query().insertAndFetch({
      id: validatedInput.id
    });

    return domain;
  }
}
