import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { WorkflowService } from "../../internal/services/workflow-service";
import { getSystemContext } from "../../auth/helpers";
import { getWorkflowTypeForOrder } from "../../workflows";
import { registerJobHandler } from "../../../worker";
import { ORDER_STATUS } from "../../internal/db/models/order";
import { OrderService } from "../../internal/services/order-service";

interface Payload {
  orderId: number;
}

const logger = getLogger("JOB:create-workflow-for-order");

export class CreateWorkflowForOrderJobHandler implements JobHandler<Payload> {
  readonly jobName = "create-workflow-for-order";
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    const systemContext = await getSystemContext();

    const existingWorkflow = await new WorkflowService(systemContext).getFirst({
      orderId: payload.orderId
    });

    if (existingWorkflow) {
      return;
    }

    const workflowType = await getWorkflowTypeForOrder(payload.orderId);

    if (!workflowType) {
      logger.error(
        `Unable to find an appropriate workflow type for Order #${payload.orderId}.`
      );
      return;
    }

    const workflow = await new WorkflowService(systemContext).create({
      type: workflowType,
      orderId: payload.orderId
    });

    logger.debug(`Created <workflow|${workflow.id}>`);

    await new OrderService(systemContext).update(payload.orderId, {
      status: ORDER_STATUS.IN_PROGRESS.id
    });
  };
}

registerJobHandler(new CreateWorkflowForOrderJobHandler());
