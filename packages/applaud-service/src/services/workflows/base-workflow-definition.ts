import { getLogger } from "../../logger";
import { getSystemContext } from "../auth/helpers";
import { WorkflowService } from "../internal/services/workflow-service";
import Workflow, { WORKFLOW_STATUS } from "../internal/db/models/workflow";
import Order, { ORDER_STATUS } from "../internal/db/models/order";
import { COMMON_INTERNAL_STATUSES } from "./common-internal-statuses";
import { OrderService } from "../internal/services/order-service";

const logger = getLogger("base-workflow-definition");

export class BaseWorkflowDefinition {
  readonly workflowId: number;
  private workflow: Workflow;
  private order: Order;

  constructor(workflowId: number) {
    this.workflowId = workflowId;
  }

  execute = async () => {
    logger.debug("Default execute() triggered.");
  };
  getWorkflow = async (forceRefresh: boolean = false) => {
    if (this.workflow && !forceRefresh) {
      return this.workflow;
    }
    const systemContext = await getSystemContext();
    const workflow = await new WorkflowService(systemContext).getById(
      this.workflowId
    );
    if (!workflow) {
      throw new Error(`Unable to find Workflow #${this.workflowId}.`);
    }

    this.workflow = workflow;

    return this.workflow;
  };

  getOrder = async (forceRefresh: boolean = false) => {
    if (this.order && !forceRefresh) {
      return this.order;
    }
    const systemContext = await getSystemContext();
    const workflow = await this.getWorkflow();
    const order = await new OrderService(systemContext).getById(
      workflow.orderId
    );
    if (!order) {
      throw new Error(`Unable to find Order for <workflow|${workflow.id}>`);
    }
    this.order = order;
    return order;
  };

  completeWorkflow = async () => {
    const workflow = await this.getWorkflow(true);
    if (
      workflow.status !== WORKFLOW_STATUS.COMPLETED.id ||
      workflow.internalStatus !== COMMON_INTERNAL_STATUSES.COMPLETED
    ) {
      const systemContext = await getSystemContext();
      await new WorkflowService(systemContext).update(workflow.id, {
        status: WORKFLOW_STATUS.COMPLETED.id,
        internalStatus: COMMON_INTERNAL_STATUSES.COMPLETED
      });
    }
  };

  completeOrder = async () => {
    const order = await this.getOrder(true);
    if (order.status !== ORDER_STATUS.COMPLETED.id) {
      const systemContext = await getSystemContext();
      await new OrderService(systemContext).update(order.id, {
        status: ORDER_STATUS.COMPLETED.id
      });
    }
  };

  ensureWorkflowInternalStatus = async (newStatus: string) => {
    const workflow = await this.getWorkflow(true);
    if (workflow.internalStatus !== newStatus) {
      const systemContext = await getSystemContext();
      await new WorkflowService(systemContext).update(this.workflowId, {
        internalStatus: newStatus
      });
      await this.getWorkflow(true);
    }
  };

  ensureWorkflowStatus = async (newStatus: string) => {
    const workflow = await this.getWorkflow(true);
    if (workflow.status !== newStatus) {
      const systemContext = await getSystemContext();
      await new WorkflowService(systemContext).update(workflow.id, {
        status: newStatus
      });
      await this.getWorkflow(true);
    }
  };
}
