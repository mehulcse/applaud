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
import ChecklistItem from "../db/models/checklist-item";
import { ChecklistService } from "./checklist-service";
import { TaskService } from "./task-service";

export interface ChecklistItemsOptions extends PaginationArgs {
  checklistId?: number;
}

export interface CreateChecklistItemInput {
  checklistId: number;
  name: string;
  order: number;
}

export interface UpdateChecklistItemInput {
  completedAt?: Date | null;
}

export class ChecklistItemService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<ChecklistItem> {
    const viewer = ensureUser(this.context.viewer);

    const query = ChecklistItem.query();
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
    const checklistItem = await query.findById(id);
    return checklistItem || null;
  }

  private getAllQuery(options: ChecklistItemsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.checklistId) {
      query.where({ checklistId: options.checklistId });
    }

    // Only a single sort option (by order)
    query.orderBy(`${ChecklistItem.tableName}.order`, "asc");

    return query;
  }

  async getFirst(options: ChecklistItemsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: ChecklistItemsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: ChecklistItemsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateChecklistItemInput) {
    // Validation
    const schema = yup.object().shape({
      checklistId: yup
        .number()
        .label("Checklist ID")
        .required()
        .nullable(false),
      name: yup
        .string()
        .label("Name")
        .required()
        .nullable(false),
      order: yup
        .number()
        .label("Order")
        .required()
        .nullable(false)
        .min(1)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateChecklistItemInput;

    ensureSystemUser(this.context.viewer);

    const checklist = await new ChecklistService(this.context).getById(
      validatedInput.checklistId
    );
    if (!checklist) {
      throw new Error("Invalid Checklist ID specified.");
    }

    const checklistItem = await ChecklistItem.query().insertAndFetch({
      customerId: checklist.customerId,
      checklistId: checklist.id,
      name: validatedInput.name,
      createdAt: new Date(),
      completedAt: null,
      order: validatedInput.order
    });

    return checklistItem;
  }

  async update(checklistItemId: number, updates: UpdateChecklistItemInput) {
    const originalChecklistItem = await this.getById(checklistItemId);

    if (!originalChecklistItem) {
      throw new Error("Invalid Checklist Item ID specified.");
    }
    // Validation
    const schema = yup.object().shape({
      completedAt: yup
        .date()
        .label("Completed At")
        .notRequired()
        .nullable(true)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateChecklistItemInput;

    const viewer = ensureUser(this.context.viewer);

    const checklist = await new ChecklistService(this.context).getById(
      originalChecklistItem.checklistId
    );
    if (!checklist) {
      throw new Error("Invalid Checklist Item ID specified.");
    }

    const task = await new TaskService(this.context).getById(checklist.taskId);
    if (!task) {
      throw new Error("Unable to find Task associated with Checklist Item.");
    }

    if (task.assignedUserId !== viewer.userId) {
      throw new Error(
        "Checklist Item can only be completed by user assigned to the associated Task."
      );
    }

    const updatedChecklistItem = await ChecklistItem.query().patchAndFetchById(
      checklistItemId,
      validatedUpdates
    );
    return updatedChecklistItem;
  }
}
