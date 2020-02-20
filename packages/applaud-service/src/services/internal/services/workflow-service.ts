import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser, ensureSystemUser } from "../../auth/helpers";
import Workflow, { WORKFLOW_STATUS } from "../db/models/workflow";
import { OrderService } from "./order-service";
import { COMMON_INTERNAL_STATUSES } from "../../workflows/common-internal-statuses";
import { AppContext } from "../../auth/app-context";
import { WorkflowCreatedJobHandler } from "../../jobs";
import { WorkflowUpdatedJobHandler } from "../../jobs/handlers/workflow-updated";

export interface WorkflowsOptions extends PaginationArgs {
  orderId?: number;
}

export interface CreateWorkflowInput {
  orderId: number;
  type: string;
}

export interface UpdateWorkflowInput {
  status?: string;
  internalStatus?: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class WorkflowService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Workflow> {
    const viewer = ensureUser(this.context.viewer);

    const query = Workflow.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else {
      // TODO: for now, only admins can access workflows
      throw new Error("Unauthorized access.");
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

  private getAllQuery(options: WorkflowsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.orderId) {
      query.where({ orderId: options.orderId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Workflow.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Workflow.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Workflow.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: WorkflowsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: WorkflowsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: WorkflowsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateWorkflowInput) {
    // Validation
    const schema = yup.object().shape({
      orderId: yup
        .number()
        .label("Order ID")
        .required()
        .nullable(false),
      type: yup
        .string()
        .label("Type")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateWorkflowInput;

    // Only allow the system to create workflows
    ensureSystemUser(this.context.viewer);

    const order = await new OrderService(this.context).getById(
      validatedInput.orderId
    );

    if (!order) {
      throw new Error("Invalid Order ID specified.");
    }

    const existingWorkflow = await this.getFirst({
      orderId: validatedInput.orderId
    });

    if (existingWorkflow && existingWorkflow.type === validatedInput.type) {
      throw new Error(
        "A Workflow of the same type already exists for the specified order."
      );
    }

    const workflow = await Workflow.query().insertAndFetch({
      status: WORKFLOW_STATUS.NEW.id,
      customerId: order.customerId,
      type: validatedInput.type,
      orderId: validatedInput.orderId,
      internalStatus: COMMON_INTERNAL_STATUSES.INITIAL,
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    });

    // Enqueue event handler job
    await new WorkflowCreatedJobHandler().enqueue({ workflowId: workflow.id });

    return workflow;
  }

  async update(workflowId: number, updates: UpdateWorkflowInput) {
    const originalWorkflow = await this.getById(workflowId);
    if (!originalWorkflow) {
      throw new Error("Invalid Workflow ID specified.");
    }

    const schema = yup.object().shape({
      status: yup
        .string()
        .label("Status")
        .notRequired()
        .nullable(false),
      internalStatus: yup
        .string()
        .label("Internal Status")
        .notRequired()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateWorkflowInput;

    const updatedWorkflow = await Workflow.query().patchAndFetchById(
      workflowId,
      { ...validatedUpdates, lastUpdatedAt: new Date() }
    );

    await new WorkflowUpdatedJobHandler().enqueue({
      original: originalWorkflow,
      updated: updatedWorkflow
    });

    return updatedWorkflow;
  }
}
