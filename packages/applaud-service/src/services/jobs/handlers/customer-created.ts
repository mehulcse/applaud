import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { registerJobHandler } from "../../../worker";

interface Payload {
  customerId: number;
}

const logger = getLogger("JOB:customer-created");

export class CustomerCreatedJobHandler implements JobHandler<Payload> {
  jobName = "customer-created";
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    logger.info(`<customer|${payload.customerId}> created`);
  };
}

registerJobHandler(new CustomerCreatedJobHandler());
