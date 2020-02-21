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
import Team from "../db/models/teams";
import { AppContext } from "../../auth/app-context";
import { UserTeamService } from "./user-team-service";

export interface TeamsOptions extends PaginationArgs {
  search?: string;
  ids?: number[];
  userId?: number;
}

export interface CreateTeamInput {
  name: string;
  description: string;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class TeamService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Team> {
    const viewer = ensureUser(this.context.viewer);

    const query = Team.query();

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
    const team = await query.findById(id);
    return team || null;
  }

  private getAllQuery(options: TeamsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    if (options.userId) {
      query.whereIn(
        "id",
        new UserTeamService(this.context)
          .getAllQuery({
            userId: options.userId
          })
          .select("teamId")
      );
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Team.tableName}.name`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Team.tableName}.name`, "desc");
        break;
      default:
        query.orderBy(`${Team.tableName}.name`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: TeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: TeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: TeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateTeamInput) {
    ensureAdmin(this.context.viewer);

    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Team Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false),
      description: yup
        .string()
        .label("Team Description")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateTeamInput;

    // Create the team and insert into database
    const team = await Team.query().insertAndFetch({
      name: validatedInput.name,
      description: validatedInput.description
    });

    // TODO: trigger team created event

    return team;
  }

  async update(teamId: number, updates: UpdateTeamInput) {
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
        .label("Team Description")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateTeamInput;

    const team = await Team.query().updateAndFetchById(
      teamId,
      validatedUpdates
    );

    // TODO: trigger team updated event

    return team;
  }
}
