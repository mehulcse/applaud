import { JobHandler, enqueueJob } from "../";
import { getLogger } from "../../../logger";
import { registerJobHandler } from "../../../worker";
import Task, { TASK_STATUS } from "../../internal/db/models/task";
import { TaskCompletedJobHandler } from "./task-completed";

interface Payload {
  originalTask: Task;
  updatedTask: Task;
}

const JOB_NAME = "task-updated";

const logger = getLogger(`JOB:${JOB_NAME}`);

export class TaskUpdatedJobHandler implements JobHandler<Payload> {
  jobName = JOB_NAME;
  enqueue = async (payload: Payload) => {
    return enqueueJob(this.jobName, payload);
  };
  process = async (payload: Payload) => {
    const { originalTask, updatedTask } = payload;
    logger.debug(`<task|${originalTask.id}> updated`);
    if (
      originalTask.status !== TASK_STATUS.COMPLETED.id &&
      updatedTask.status === TASK_STATUS.COMPLETED.id
    ) {
      await new TaskCompletedJobHandler().enqueue({ taskId: originalTask.id });
    }
  };
}

registerJobHandler(new TaskUpdatedJobHandler());
