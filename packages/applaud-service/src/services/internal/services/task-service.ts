import * as yup from "yup";
import moment from "moment";
import { QueryInitializationResult, DateQuery } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll,
  generateDateQuery
} from "../helpers";
import {
  ensureUser,
  ensureSystemUser,
  getSystemContext
} from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";
import Task, { TASK_STATUS } from "../db/models/task";
import { UnauthorizedAccessError } from "../../../errors";
import { WorkflowService } from "./workflow-service";
import { getLogger } from "../../../logger";
import { Logger } from "log4js";
import { VendorUserService } from "./vendor-user-service";
import { UserRoleService } from "./user-role-service";
import { ROLES, TASK_TYPES } from "../../../constants";
import { ChecklistItemService } from "./checklist-item-service";
import { ChecklistService } from "./checklist-service";
import { TaskUpdatedJobHandler } from "../../jobs/handlers/task-updated";

export interface TasksOptions extends PaginationArgs<TasksSort> {
  customerIds?: number[];
  vendorIds?: number[];
  workflowIds?: number[];
  taskTypeIds?: string[];
  statusIds?: string[];
  availableAt?: DateQuery;
  assignedUserIds?: number[];
}

export interface CreateTaskInput {
  workflowId: number;
  vendorId: number | null;
  taskTypeId: string;
  availableAt?: Date;
  assignedUserId?: number | null;
}

export interface UpdateTaskInput {
  status?: string;
  assignedUserId?: number | null;
}

export type TasksSort = "priority" | "id_asc" | "id_desc";

export class TaskService {
  readonly context: AppContext;
  private readonly logger: Logger;
  constructor(context: AppContext) {
    this.context = context;
    this.logger = getLogger(`TaskService (${context.requestId})`);
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Task> {
    const viewer = ensureUser(this.context.viewer);

    const query = Task.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      // TODO: do Partner Users need access to Tasks?
      throw new UnauthorizedAccessError();
    } else if (viewer.vendorUsers.length > 0) {
      query.whereIn("vendorId", viewer.vendorUsers.map(x => x.vendorId));
      // TODO: in the future may need to limit by task types allowed for the user
    } else {
      throw new UnauthorizedAccessError();
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const customerBudget = await query.findById(id);
    return customerBudget || null;
  }

  getAllQuery(options: TasksOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.customerIds && options.customerIds.length > 0) {
      query.whereIn("customerId", options.customerIds);
    }

    if (options.vendorIds && options.vendorIds.length > 0) {
      query.whereIn("vendorId", options.vendorIds);
    }

    if (options.workflowIds && options.workflowIds.length > 0) {
      query.whereIn("workflowId", options.workflowIds);
    }

    if (options.taskTypeIds && options.taskTypeIds.length > 0) {
      query.whereIn("taskTypeId", options.taskTypeIds);
    }

    if (options.statusIds && options.statusIds.length > 0) {
      query.whereIn("status", options.statusIds);
    }

    if (options.availableAt) {
      generateDateQuery(query, "availableAt", options.availableAt);
    }

    if (options.assignedUserIds && options.assignedUserIds.length > 0) {
      query.whereIn("assignedUserId", options.assignedUserIds);
    }

    switch (options.sort) {
      case "id_asc":
        query.orderBy(`${Task.tableName}.id`, "asc");
        break;
      case "id_desc":
        query.orderBy(`${Task.tableName}.id`, "desc");
        break;
      case "priority":
        query.orderBy(`${Task.tableName}.availableAt`, "asc");
        break;
      default:
        query.orderBy(`${Task.tableName}.availableAt`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: TasksOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: TasksOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: TasksOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateTaskInput) {
    // Validation
    const schema = yup.object().shape({
      workflowId: yup
        .number()
        .label("Workflow ID")
        .required()
        .nullable(false),
      vendorId: yup
        .number()
        .label("Vendor ID")
        .notRequired()
        .nullable(true),
      taskTypeId: yup
        .string()
        .label("Task Type ID")
        .required()
        .nullable(false),
      availableAt: yup
        .date()
        .label("Available At")
        .default(new Date())
        .notRequired()
        .nullable(false)
        .min(
          moment
            .utc()
            .add(-1, "hour")
            .toDate()
        )
        .max(
          moment
            .utc()
            .add(1, "month")
            .toDate()
        ),
      assignedUserId: yup
        .number()
        .label("Assigned User ID")
        .notRequired()
        .nullable(true)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateTaskInput;

    // Only allow the system to create tasks
    ensureSystemUser(this.context.viewer);

    const workflow = await new WorkflowService(this.context).getById(
      validatedInput.workflowId
    );

    if (!workflow) {
      throw new Error("Invalid Workflow ID specified.");
    }

    // TODO: can/should we do a duplicate check to prevent duplicate tasks?
    // TODO: validate that user can be assigned to task
    // TODO: validate task type

    let calculatedStatus = TASK_STATUS.PENDING.id;
    if (
      !validatedInput.availableAt ||
      validatedInput.availableAt <= new Date()
    ) {
      calculatedStatus = TASK_STATUS.AVAILABLE.id;
    }
    if (!!validatedInput.assignedUserId) {
      calculatedStatus = TASK_STATUS.ASSIGNED.id;
    }

    const task = await Task.query().insertAndFetch({
      customerId: workflow.customerId,
      vendorId: validatedInput.vendorId,
      workflowId: workflow.id,
      taskTypeId: validatedInput.taskTypeId,
      status: calculatedStatus,
      createdAt: new Date(),
      availableAt: validatedInput.availableAt,
      assignedUserId: validatedInput.assignedUserId
    });

    this.logger.debug(`<task|${task.id}> created`);

    return task;
  }

  async update(taskId: number, updates: UpdateTaskInput) {
    ensureUser(this.context.viewer);

    const originalTask = await this.getById(taskId);
    if (!originalTask) {
      throw new Error("Invalid Task ID specified.");
    }

    const schema = yup.object().shape({
      status: yup
        .string()
        .label("Status")
        .notRequired()
        .nullable(false)
        .oneOf(Object.values(TASK_STATUS).map(status => status.id)),
      assignedUserId: yup
        .number()
        .label("Assigned User ID")
        .notRequired()
        .nullable(true)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateTaskInput;

    const updateQuery = Task.query().findById(taskId);

    if (
      validatedUpdates.assignedUserId !== undefined &&
      validatedUpdates.assignedUserId !== originalTask.assignedUserId
    ) {
      // Assigned User has changed, make sure it's an allowed change
      await this.validateAssignedUserChange(
        originalTask,
        validatedUpdates.assignedUserId
      );
      validatedUpdates.status =
        validatedUpdates.assignedUserId === null
          ? TASK_STATUS.AVAILABLE.id
          : TASK_STATUS.ASSIGNED.id;
      if (originalTask.assignedUserId === null) {
        updateQuery.whereNull("assignedUserId");
      } else {
        updateQuery.where({ assignedUserId: originalTask.assignedUserId });
      }
    }

    if (
      validatedUpdates.status !== undefined &&
      validatedUpdates.status !== originalTask.status
    ) {
      // Trying to change status, make sure it's an allowed change
      await this.validateStatusChange(
        originalTask,
        validatedUpdates.status,
        validatedUpdates.assignedUserId
      );
      updateQuery.where({ status: originalTask.status });
    }

    const numberOfAffectedRows = await updateQuery.patch(validatedUpdates);
    if (numberOfAffectedRows === 0) {
      throw new Error("Unable to update task.");
    }

    const updatedTask = await this.getById(taskId);
    if (!updatedTask) {
      throw new Error(`Unable to find <task|${taskId}>.`);
    }

    await new TaskUpdatedJobHandler().enqueue({ originalTask, updatedTask });

    return updatedTask;
  }

  private async validateAssignedUserChange(
    task: Task,
    newAssignedUserId: number | null
  ): Promise<void> {
    if (task.status === TASK_STATUS.PENDING.id) {
      throw new Error("Unable to change assigned user for a pending task.");
    }
    if (task.status === TASK_STATUS.COMPLETED.id) {
      throw new Error("Unable to change assigned user for a completed task.");
    }
    if (task.status === TASK_STATUS.CANCELLED.id) {
      throw new Error("Unable to change assigned user for a cancelled task.");
    }

    if (newAssignedUserId === null) {
      const viewer = ensureUser(this.context.viewer);
      // Tasks assigned to other users can only be unassigned by admins
      if (task.assignedUserId !== viewer.userId && !viewer.isAdmin) {
        throw new Error(
          "Tasks can only be unassigned from other users by admins."
        );
      }
    } else {
      // newAssignedUserId is not null
      const systemContext = await getSystemContext(this.context.requestId);
      const userRoles = await new UserRoleService(systemContext).getAll({
        userId: newAssignedUserId,
        roleIds: [ROLES.ADMIN, ROLES.SUPER_ADMIN]
      });
      if (userRoles.length === 0) {
        const vendorUser = await new VendorUserService(systemContext).getFirst({
          userId: newAssignedUserId,
          vendorId: task.vendorId || 1
        });
        if (!vendorUser) {
          throw new Error("Specified user cannot be assigned to this task.");
        }
      }
    }
  }

  private async validateStatusChange(
    task: Task,
    newStatus: string,
    newAssignedUserId?: number | null
  ): Promise<void> {
    if (task.status === TASK_STATUS.PENDING.id) {
      if (
        newStatus === TASK_STATUS.AVAILABLE.id &&
        task.availableAt > new Date()
      ) {
        throw new Error(
          "Unable to change status of task until availableAt date has elapsed."
        );
      }
      if (newStatus === TASK_STATUS.ASSIGNED.id && !newAssignedUserId) {
        throw new Error(
          'Unable to change status to "Assigned" without assigning a user.'
        );
      }
    }
    if (task.status === TASK_STATUS.AVAILABLE.id) {
      if (newStatus !== TASK_STATUS.ASSIGNED.id) {
        throw new Error('"Available" tasks can only be changed to "Assigned".');
      }
      if (!newAssignedUserId) {
        throw new Error(
          'Must also specify an assigned user to change task to "Assigned".'
        );
      }
    }
    if (task.status === TASK_STATUS.ASSIGNED.id) {
      if (newStatus === TASK_STATUS.COMPLETED.id) {
        if (task.taskTypeId === TASK_TYPES.CHECKLIST) {
          await this.validateCompletionForChecklistTask(task);
        }
      }
      if (newStatus === TASK_STATUS.AVAILABLE.id && newAssignedUserId !== null) {
        throw new Error(
          'Assigned User must also be set to null to change task to "Available".'
        );
      }
    }
  }

  private async validateCompletionForChecklistTask(task: Task): Promise<void> {
    const checklist = await new ChecklistService(this.context).getFirst({
      taskId: task.id
    });
    if (!checklist) {
      throw new Error("Unable to find associated checklist.");
    }
    const checklistItems = await new ChecklistItemService(this.context).getAll({
      checklistId: checklist.id
    });
    if (!checklistItems.every(x => !!x.completedAt)) {
      throw new Error(
        "All checklist items must be completed before task can be completed."
      );
    }
  }
}
