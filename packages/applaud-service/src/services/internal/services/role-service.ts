import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser } from "../../auth/helpers";
import Role from "../db/models/role";
import { AppContext } from "../../auth/app-context";

export interface RolesOptions extends PaginationArgs {
  search?: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class RoleService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Role> {
    ensureUser(this.context.viewer);

    const query = Role.query();

    return {
      query
    };
  }

  async getById(id: string) {
    const { query } = this.initializeAuthorizedQuery();
    const role = await query.findById(id);
    return role || null;
  }

  private getAllQuery(options: RolesOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Role.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Role.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Role.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: RolesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: RolesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: RolesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }
}
