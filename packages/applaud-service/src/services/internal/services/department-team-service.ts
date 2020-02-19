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
import { DepartmentService } from "./department-service";
import { TeamService } from "./team-service";
import DepartmentTeam from "../db/models/department-team";
import { AppContext } from "../../auth/app-context";

export interface DepartmentTeamsOptions extends PaginationArgs {
  departmentId?: number;
  teamsIds?: number[];
}

export interface CreateDepartmentTeamInput {
  departmentId: number;
  teamId: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class DepartmentTeamService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<DepartmentTeam> {
    ensureUser(this.context.viewer);

    const query = DepartmentTeam.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const departmentTeam = await query.findById(id);
    return departmentTeam || null;
  }

  getAllQuery(options: DepartmentTeamsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.departmentId) {
      query.where({ departmentId: options.departmentId });
    }
    if (options.teamsIds && options.teamsIds.length > 0) {
      query.whereIn("teamId", options.teamsIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${DepartmentTeam.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${DepartmentTeam.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${DepartmentTeam.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: DepartmentTeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: DepartmentTeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: DepartmentTeamsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateDepartmentTeamInput, trx?: Objection.Transaction) {
    ensureAdmin(this.context.viewer);

    const schema = yup.object().shape({
      departmentId: yup
        .number()
        .label("Department ID")
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
    })) as CreateDepartmentTeamInput;

    const department = await new DepartmentService(this.context).getById(
      validatedInput.departmentId
    );
    if (!department) {
      throw new Error("Department ID is not valid.");
    }

    const team = await new TeamService(this.context).getById(
      validatedInput.teamId
    );
    if (!team) {
      throw new Error("Team ID is not valid.");
    }

    const existingDepartmentTeam = await DepartmentTeam.query()
      .where({ departmentId: validatedInput.departmentId, teamId: validatedInput.teamId })
      .first();
    if (existingDepartmentTeam) {
      return {
        departmentTeam: existingDepartmentTeam
      };
    }

    const departmentTeam = await DepartmentTeam.query(trx).insertAndFetch({
      departmentId: validatedInput.departmentId,
      teamId: validatedInput.teamId,
      createdAt: moment.utc().toDate()
    });

    return departmentTeam;
  }
}
