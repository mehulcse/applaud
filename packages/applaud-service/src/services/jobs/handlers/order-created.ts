import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { CreateWorkflowForOrderJobHandler } from "./create-workflow-for-order";
import { registerJobHandler } from "../../../worker";
import { getSystemContext } from "../../auth/helpers";
import { OrderService } from "../../internal/services/order-service";

interface Payload {
  orderId: number;
}

const logger = getLogger("JOB:order-created");

export class OrderCreatedJobHandler implements JobHandler<Payload> {
  jobName = "order-created";
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    logger.debug(`<order|${payload.orderId}> created`);
    const systemContext = await getSystemContext();
    const order = await new OrderService(systemContext).getById(
      payload.orderId
    );
    if (!order) {
      logger.warn(`Unable to find <order|${payload.orderId}>`);
      return;
    }
    if (order.startDate > new Date()) {
      logger.debug(
        `<order|${payload.orderId}> startDate is in the future. No further action required.`
      );
      return;
    }
    await new CreateWorkflowForOrderJobHandler().enqueue({
      orderId: payload.orderId
    });
  };
}

registerJobHandler(new OrderCreatedJobHandler());
