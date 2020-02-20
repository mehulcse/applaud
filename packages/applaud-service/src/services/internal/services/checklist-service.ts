import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { CustomerService } from "./customer-service";
import { ensureUser, ensureSystemUser } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";
import Checklist from "../db/models/checklist";
import { TaskService } from "./task-service";
import { ChecklistDefinitionService } from "./checklist-definition-service";

export interface ChecklistsOptions extends PaginationArgs {
  customerId?: number;
  taskId?: number;
}

export interface CreateChecklistInput {
  taskId: number;
  checklistDefinitionId: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class ChecklistService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Checklist> {
    const viewer = ensureUser(this.context.viewer);

    const query = Checklist.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.vendorUsers.length > 0) {
      query.whereIn(
        "customerId",
        new CustomerService(this.context).getAllQuery({}).select("id")
      );
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const checklist = await query.findById(id);
    return checklist || null;
  }

  private getAllQuery(options: ChecklistsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.customerId) {
      query.where({ customerId: options.customerId });
    }

    if (options.taskId) {
      query.where({ taskId: options.taskId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Checklist.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Checklist.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Checklist.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: ChecklistsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: ChecklistsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: ChecklistsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateChecklistInput) {
    // Validation
    const schema = yup.object().shape({
      taskId: yup
        .number()
        .label("Task ID")
        .required()
        .nullable(false),
      checklistDefinitionId: yup
        .number()
        .label("Checklist Definition ID")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateChecklistInput;

    ensureSystemUser(this.context.viewer);

    const task = await new TaskService(this.context).getById(
      validatedInput.taskId
    );

    if (!task) {
      throw new Error("Invalid Task ID specified.");
    }

    const checklistDefinition = await new ChecklistDefinitionService(
      this.context
    ).getById(validatedInput.checklistDefinitionId);
    if (!checklistDefinition) {
      throw new Error("Invalid Checklist Definition ID specified.");
    }

    // Create the partner and insert into database
    const checklist = await Checklist.query().insertAndFetch({
      customerId: task.customerId,
      checklistDefinitionId: validatedInput.checklistDefinitionId,
      name: checklistDefinition.name,
      taskId: validatedInput.taskId,
      createdAt: new Date()
    });

    return checklist;
  }
}
