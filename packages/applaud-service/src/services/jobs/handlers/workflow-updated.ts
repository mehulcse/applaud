import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { registerJobHandler } from "../../../worker";
import Workflow, { WORKFLOW_STATUS } from "../../internal/db/models/workflow";
import { getSystemContext } from "../../auth/helpers";
import { ORDER_STATUS } from "../../internal/db/models/order";
import { OrderService } from "../../internal/services/order-service";

interface Payload {
  original: Workflow;
  updated: Workflow;
}

const JOB_NAME = "workflow-updated";

const logger = getLogger(`JOB:${JOB_NAME}`);

export class WorkflowUpdatedJobHandler implements JobHandler<Payload> {
  jobName = JOB_NAME;
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    const { original, updated } = payload;
    logger.debug(`<workflow|${original.id}> updated`);
    if (
      original.status !== WORKFLOW_STATUS.COMPLETED.id &&
      updated.status === WORKFLOW_STATUS.COMPLETED.id
    ) {
      logger.info(`<workflow|${original.id}> was completed`);

      // Right now, we only have a single workflow per order, so if workflow is complete, so is order
      const systemContext = await getSystemContext();
      await new OrderService(systemContext).update(original.orderId, {
        status: ORDER_STATUS.COMPLETED.id
      });
    }
  };
}

registerJobHandler(new WorkflowUpdatedJobHandler());
