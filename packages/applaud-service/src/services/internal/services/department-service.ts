import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureAdmin, ensureUser } from "../../auth/helpers";
import Department from "../db/models/department";
import { AppContext } from "../../auth/app-context";

export interface DepartmentsOptions extends PaginationArgs {
  search?: string;
  ids?: number[];
}

export interface CreateDepartmentInput {
  name: string;
  description: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  description?: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class DepartmentService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Department> {
    const viewer = ensureUser(this.context.viewer);

    const query = Department.query();

    if (viewer.isAdmin) {
      // No restrictions
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const department = await query.findById(id);
    return department || null;
  }

  private getAllQuery(options: DepartmentsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Department.tableName}.name`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Department.tableName}.name`, "desc");
        break;
      default:
        query.orderBy(`${Department.tableName}.name`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: DepartmentsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: DepartmentsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: DepartmentsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateDepartmentInput) {
    ensureAdmin(this.context.viewer);

    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Department Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false),
      description: yup
        .string()
        .label("Department Description")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateDepartmentInput;

    // Create the department and insert into database
    const department = await Department.query().insertAndFetch({
      name: validatedInput.name,
      description: validatedInput.description
    });

    // TODO: trigger department created event

    return department;
  }

  async update(departmentId: number, updates: UpdateDepartmentInput) {
    ensureAdmin(this.context.viewer);
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false),
      description: yup
        .string()
        .label("Department Description")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateDepartmentInput;

    const department = await Department.query().updateAndFetchById(
      departmentId,
      validatedUpdates
    );

    // TODO: trigger department updated event

    return department;
  }
}
