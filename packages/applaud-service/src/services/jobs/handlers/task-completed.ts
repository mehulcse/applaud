import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { ExecuteWorkflowJobHandler } from "./execute-workflow";
import { registerJobHandler } from "../../../worker";
import { getSystemContext } from "../../auth/helpers";
import { TaskService } from "../../internal/services/task-service";

interface Payload {
  taskId: number;
}

const JOB_NAME = "task-completed";

const logger = getLogger(`JOB:${JOB_NAME}`);

export class TaskCompletedJobHandler implements JobHandler<Payload> {
  jobName = JOB_NAME;
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    logger.info(`<task|${payload.taskId}> completed`);

    const systemContext = await getSystemContext();
    const task = await new TaskService(systemContext).getById(payload.taskId);
    if (!task) {
      logger.error(`Unabled to find <task|${payload.taskId}>`);
      return;
    }

    await new ExecuteWorkflowJobHandler().enqueue({
      workflowId: task.workflowId
    });
  };
}

registerJobHandler(new TaskCompletedJobHandler());
