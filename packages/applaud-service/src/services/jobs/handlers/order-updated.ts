import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { registerJobHandler } from "../../../worker";
import Order, { ORDER_STATUS } from "../../internal/db/models/order";

interface Payload {
  original: Order;
  updated: Order;
}

const JOB_NAME = "order-updated";

const logger = getLogger(`JOB:${JOB_NAME}`);

export class OrderUpdatedJobHandler implements JobHandler<Payload> {
  jobName = JOB_NAME;
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    const { original, updated } = payload;
    logger.debug(`<order|${original.id}> updated`);
    if (
      original.status !== ORDER_STATUS.COMPLETED.id &&
      updated.status === ORDER_STATUS.COMPLETED.id
    ) {
      logger.info(`<order|${original.id}> was completed`);
    }
  };
}

registerJobHandler(new OrderUpdatedJobHandler());
