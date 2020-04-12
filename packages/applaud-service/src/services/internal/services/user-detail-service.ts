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
import { ensureUser, ensureAdmin } from "../../auth/helpers";
import { UserService } from "./user-service";
import UserDetail from "../db/models/user-details";
import { AppContext } from "../../auth/app-context";
import { getLogger } from "../../../logger";

const logger = getLogger("User detail service");

export interface UserDetailsOptions extends PaginationArgs {
  userId?: number;
}

export interface CreateUserDetailInput {
  userId: number;
  slackHandle: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class UserDetailService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<UserDetail> {
    ensureUser(this.context.viewer);

    const query = UserDetail.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const userDetail = await query.findById(id);
    return userDetail || null;
  }

  getAllQuery(options: UserDetailsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.userId) {
      query.where({ userId: options.userId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${UserDetail.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${UserDetail.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${UserDetail.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: UserDetailsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: UserDetailsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: UserDetailsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(
    input: CreateUserDetailInput,
    skipValidation: boolean,
    trx?: Objection.Transaction
  ) {
    ensureAdmin(this.context.viewer);

    const schema = yup.object().shape({
      userId: yup
        .number()
        .label("User ID")
        .required()
        .nullable(false),
      slackHandle: yup
        .string()
        .label("Slack Handle")
        .required()
        .nullable(false)
    });

    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateUserDetailInput;

    if (!skipValidation) {
      const user = await new UserService(this.context).getById(
        validatedInput.userId
      );

      if (!user) {
        throw new Error("User ID is not valid.");
      }

      const existingUserDetails = await UserDetail.query()
        .where({ userId: validatedInput.userId })
        .first();

      if (existingUserDetails) {
        return {
          userDetail: existingUserDetails
        };
      }
    }

    const userDetail = await UserDetail.query(trx).insertAndFetch({
      userId: validatedInput.userId,
      slackHandle: validatedInput.slackHandle
    });

    logger.debug(userDetail);

    return userDetail;
  }

  async update(
    input: CreateUserDetailInput,
    skipValidation: boolean,
    trx?: Objection.Transaction
  ) {
    ensureUser(this.context.viewer);

    const schema = yup.object().shape({
      userId: yup
        .number()
        .label("User ID")
        .required()
        .nullable(false),
      slackHandle: yup
        .string()
        .label("Slack Handle")
        .required()
        .nullable(false)
    });

    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateUserDetailInput;

    if (!skipValidation) {
      const user = await new UserService(this.context).getById(
        validatedInput.userId
      );

      if (!user) {
        throw new Error("User ID is not valid.");
      }
    }

    const userDetail = await UserDetail.query(trx)
      .patchAndFetch({
        slackHandle: validatedInput.slackHandle
      })
      .where({
        userId: validatedInput.userId
      });

    logger.debug(userDetail);

    return userDetail;
  }
}
