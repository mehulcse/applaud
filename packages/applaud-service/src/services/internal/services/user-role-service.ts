import moment from "moment";
import * as yup from "yup";
import Objection from "objection";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser, ensureAdmin, ensureSuperAdmin } from "../../auth/helpers";
import { UserService } from "./user-service";
import { RoleService } from "./role-service";
import { ROLES } from "../../../constants";
import UserRole from "../db/models/user-role";
import { AppContext } from "../../auth/app-context";

export interface UserRolesOptions extends PaginationArgs {
  userId?: number;
  roleIds?: string[];
}

export interface CreateUserRoleInput {
  userId: number;
  roleId: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class UserRoleService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<UserRole> {
    ensureUser(this.context.viewer);

    const query = UserRole.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const userRole = await query.findById(id);
    return userRole || null;
  }

  getAllQuery(options: UserRolesOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.userId) {
      query.where({ userId: options.userId });
    }
    if (options.roleIds && options.roleIds.length > 0) {
      query.whereIn("roleId", options.roleIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${UserRole.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${UserRole.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${UserRole.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: UserRolesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: UserRolesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: UserRolesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateUserRoleInput, trx?: Objection.Transaction) {
    ensureAdmin(this.context.viewer);

    const schema = yup.object().shape({
      userId: yup
        .number()
        .label("User ID")
        .required()
        .nullable(false),
      roleId: yup
        .string()
        .label("Role ID")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateUserRoleInput;

    const user = await new UserService(this.context).getById(
      validatedInput.userId
    );
    if (!user) {
      throw new Error("User ID is not valid.");
    }

    const role = await new RoleService(this.context).getById(
      validatedInput.roleId
    );
    if (!role) {
      throw new Error("Role ID is not valid.");
    }

    if (validatedInput.roleId === ROLES.SUPER_ADMIN) {
      ensureSuperAdmin(this.context.viewer);
    }

    const existingUserRole = await UserRole.query()
      .where({ userId: validatedInput.userId, roleId: validatedInput.roleId })
      .first();
    if (existingUserRole) {
      return {
        userRole: existingUserRole
      };
    }

    const userRole = await UserRole.query(trx).insertAndFetch({
      userId: validatedInput.userId,
      roleId: validatedInput.roleId,
      createdAt: moment.utc().toDate()
    });

    return userRole;
  }
}
