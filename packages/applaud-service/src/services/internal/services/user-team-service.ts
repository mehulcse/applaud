import moment from "moment";
import Objection from "objection";
import * as yup from "yup";
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
import { TeamService } from "./team-service";
import UserTeam from "../db/models/user-team";
import { AppContext } from "../../auth/app-context";

export interface UserTeamsOptions extends PaginationArgs {
  userId?: number;
  teamId?: number;
  teamsIds?: number[];
}

export interface CreateUserTeamInput {
  userId: number;
  teamId: number;
}

export interface DeleteUserTeamInput {
  userId: number;
  teamId: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class UserTeamService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<UserTeam> {
    ensureUser(this.context.viewer);

    const query = UserTeam.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const userTeam = await query.findById(id);
    return userTeam || null;
  }

  getAllQuery(options: UserTeamsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.userId) {
      query.where({ userId: options.userId });
    }

    if (options.teamId) {
      query.where({ teamId: options.teamId });
    }

    if (options.teamsIds && options.teamsIds.length > 0) {
      query.whereIn("teamId", options.teamsIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${UserTeam.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${UserTeam.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${UserTeam.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: UserTeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: UserTeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: UserTeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateUserTeamInput, trx?: Objection.Transaction) {
    ensureAdmin(this.context.viewer);

    const schema = yup.object().shape({
      userId: yup
        .number()
        .label("User ID")
        .required()
        .nullable(false),
      teamId: yup
        .number()
        .label("Team ID")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateUserTeamInput;

    const user = await new UserService(this.context).getById(
      validatedInput.userId
    );
    if (!user) {
      throw new Error("User ID is not valid.");
    }

    const team = await new TeamService(this.context).getById(
      validatedInput.teamId
    );
    if (!team) {
      throw new Error("Team ID is not valid.");
    }

    const existingUserTeam = await UserTeam.query()
      .where({ userId: validatedInput.userId, teamId: validatedInput.teamId })
      .first();
    if (existingUserTeam) {
      return {
        userTeam: existingUserTeam
      };
    }

    const userTeam = await UserTeam.query(trx).insertAndFetch({
      userId: validatedInput.userId,
      teamId: validatedInput.teamId,
      createdAt: moment.utc().toDate()
    });

    return userTeam;
  }

  async delete(input: DeleteUserTeamInput) {
    ensureAdmin(this.context.viewer);

    const schema = yup.object().shape({
      userId: yup
        .number()
        .label("User ID")
        .required()
        .nullable(false),
      teamId: yup
        .number()
        .label("Team ID")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateUserTeamInput;

    const userTeam = await this.getFirst({
      userId: validatedInput.userId,
      teamId: validatedInput.teamId
    });

    if (!userTeam) {
      throw new Error("Invalid User ID or Team ID specified.");
    }

    await UserTeam.query()
      .where({
        userId: validatedInput.userId,
        teamId: validatedInput.teamId
      })
      .delete();

    return {
      isDeleted: true
    };
  }
}
