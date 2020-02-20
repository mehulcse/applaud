import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";
import TaskType from "../db/models/task-type";
import { VendorTaskTypeService } from "./vendor-task-type-service";

export interface TaskTypesOptions extends PaginationArgs {
  search?: string;
  ids?: string[];
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class TaskTypeService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<TaskType> {
    const viewer = ensureUser(this.context.viewer);

    const query = TaskType.query();

    if (viewer.vendorUsers.length > 0) {
      query.whereIn(
        "id",
        new VendorTaskTypeService(this.context)
          .getAllQuery({})
          .select("taskTypeId")
      );
    }

    return {
      query
    };
  }

  async getById(id: string) {
    const { query } = this.initializeAuthorizedQuery();
    const taskType = await query.findById(id);
    return taskType || null;
  }

  private getAllQuery(options: TaskTypesOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`${TaskType.tableName}.name`, "like", `%${options.search}%`);
    }

    if (options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${TaskType.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${TaskType.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${TaskType.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: TaskTypesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: TaskTypesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: TaskTypesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }
}
