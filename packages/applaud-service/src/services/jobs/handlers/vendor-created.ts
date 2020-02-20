import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { registerJobHandler } from "../../../worker";
import { VendorTaskTypeService } from "../../internal/services/vendor-task-type-service";
import { getSystemContext } from "../../auth/helpers";
import { TASK_TYPES } from "../../../constants";

interface Payload {
  vendorId: number;
}

const JOB_NAME = "vendor-created";

const logger = getLogger(`JOB:${JOB_NAME}`);

export class VendorCreatedJobHandler implements JobHandler<Payload> {
  jobName = JOB_NAME;
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    logger.info(`<vendor|${payload.vendorId}> created`);

    // Add "checklist" task type
    const systemContext = await getSystemContext();
    await new VendorTaskTypeService(systemContext).create({
      taskTypeId: TASK_TYPES.CHECKLIST,
      vendorId: payload.vendorId
    });
  };
}

registerJobHandler(new VendorCreatedJobHandler());
