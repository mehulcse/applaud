import * as yup from "yup";
import { transaction } from "objection";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser } from "../../auth/helpers";
import User from "../db/models/user";
import { UserRoleService } from "./user-role-service";
import { CoinBalanceService } from "./coin-balance-service";
import { AppContext } from "../../auth/app-context";
import { ROLES } from "../../../constants";
import { DEFAULT_BALANCE } from "../db/models/coin-balance";

export interface UsersOptions extends PaginationArgs {
  search?: string;
  roleIds?: string[];
  ids?: number[];
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserInput {}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class UserService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<User> {
    ensureUser(this.context.viewer);

    const query = User.query();

    // This may need to be adjusted to allow for showing admin users to partner users
    // if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
    //   query.whereIn(
    //     "id",
    //     new PartnerUserService(this.context).getAllQuery({}).select("userId")
    //   );
    // } else if (viewer.vendorUsers.length > 0 && viewer.vendorUser) {
    //   query.whereIn(
    //     "id",
    //     new VendorUserService(this.context).getAllQuery({}).select("userId")
    //   );
    // }

    query.whereNot("id", 1);

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const user = await query.findById(id);
    return user || null;
  }

  async getByEmail(email: string) {
    const { query } = this.initializeAuthorizedQuery();
    const user = await query.first().where({ email });
    return user || null;
  }

  private getAllQuery(options: UsersOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(builder => {
        builder
          .where(`firstName`, "like", `%${options.search}%`)
          .orWhere(`lastName`, "like", `%${options.search}%`)
          .orWhere("email", "like", `%${options.search}%`);
      });
    }

    if (options.roleIds) {
      query.whereIn(
        "id",
        new UserRoleService(this.context)
          .getAllQuery({
            roleIds: options.roleIds
          })
          .select("userId")
      );
    }

    if (options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${User.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${User.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${User.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: UsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: UsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: UsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateUserInput) {
    ensureUser(this.context.viewer);

    // Validation
    const schema = yup.object().shape({
      firstName: yup
        .string()
        .label("First Name")
        .required()
        .nullable(false)
        .max(255),
      lastName: yup
        .string()
        .label("Last Name")
        .required()
        .nullable(false)
        .max(255),
      email: yup
        .string()
        .label("Email")
        .email()
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateUserInput;

    const existingUser = await this.getByEmail(validatedInput.email);
    if (existingUser) {
      throw new Error("User Already Exist.");
    }

    const user = await transaction(User.knex(), async trx => {
      const user = await User.query(trx).insertAndFetch({
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        email: validatedInput.email
      });

      await new UserRoleService(this.context).create(
        {
          userId: user.id,
          roleId: ROLES.EMPLOYEE
        },
        trx
      );

      await new CoinBalanceService(this.context).create(
        {
          userId: user.id,
          balance: DEFAULT_BALANCE
        },
        trx
      );

      return user;
    });

    // TODO: trigger user created event

    return user;
  }
}
