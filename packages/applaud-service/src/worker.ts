import { getLogger } from "./logger";
import config from "./config";
import * as jobs from "./services/jobs";
import { getDb } from "./services/internal/db";
import { SqsWorker } from "./services/jobs/sqs-worker";

const logger = getLogger();
const _jobHandlers: jobs.JobHandler<any>[] = [];

export function registerJobHandler(handler: jobs.JobHandler<any>) {
  if (!_jobHandlers.find(x => x.jobName === handler.jobName)) {
    // logger.debug(`JOB: ${handler.jobName} registered.`);
    _jobHandlers.push(handler);
    // logger.debug(
    //   `Jobs Registered: [${_jobHandlers.map(x => x.jobName).join(", ")}]`
    // );
  }
}

export async function start() {
  await getDb();
  const queueUrl = await config.getSqsQueueEndpoint();
  const sqsWorker = new SqsWorker({ handlers: _jobHandlers });
  logger.info(`Start polling Queue: ${queueUrl}`);
  await sqsWorker.start(queueUrl);
}
