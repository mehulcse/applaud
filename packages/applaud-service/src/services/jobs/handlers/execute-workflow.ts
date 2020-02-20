import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { executeWorkflow } from "../../workflows";
import { registerJobHandler } from "../../../worker";

interface Payload {
  workflowId: number;
}

const logger = getLogger("JOB:execute-workflow");

export class ExecuteWorkflowJobHandler implements JobHandler<Payload> {
  readonly jobName = "execute-workflow";
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    logger.debug(`Starting execution for Workflow #${payload.workflowId}.`);
    await executeWorkflow(payload.workflowId);
  };
}

registerJobHandler(new ExecuteWorkflowJobHandler());
