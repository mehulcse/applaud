import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser } from "../../auth/helpers";
import Product from "../db/models/product";
import { AppContext } from "../../auth/app-context";

export interface ProductsOptions extends PaginationArgs {
  search?: string;
  productIds?: string[];
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class ProductService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Product> {
    ensureUser(this.context.viewer);

    const query = Product.query();

    return {
      query
    };
  }

  async getById(id: string) {
    const { query } = this.initializeAuthorizedQuery();
    const product = await query.findById(id);
    return product || null;
  }

  private getAllQuery(options: ProductsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (options.productIds && options.productIds.length > 0) {
      query.whereIn("id", options.productIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Product.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Product.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Product.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: ProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: ProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: ProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }
}
