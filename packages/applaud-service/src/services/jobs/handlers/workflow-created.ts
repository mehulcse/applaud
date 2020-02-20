import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { ExecuteWorkflowJobHandler } from "./execute-workflow";
import { registerJobHandler } from "../../../worker";

interface Payload {
  workflowId: number;
}

const logger = getLogger("JOB:workflow-created");

export class WorkflowCreatedJobHandler implements JobHandler<Payload> {
  jobName = "workflow-created";
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    logger.info(`<workflow|${payload.workflowId}> created`);
    await new ExecuteWorkflowJobHandler().enqueue({
      workflowId: payload.workflowId
    });
  };
}

registerJobHandler(new WorkflowCreatedJobHandler());
