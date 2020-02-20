import AWS from "aws-sdk";
import config from "../../config";
import { getLogger } from "../../logger";

const logger = getLogger();

export interface JobHandler<T> {
  readonly jobName: string;
  enqueue: (payload: T) => Promise<any>;
  process: (payload: T) => Promise<any>;
}

export function getSqs() {
  const sqsConfig: AWS.SQS.ClientConfiguration = {
    region: "us-west-2"
  };
  if (config.getIsLocal()) {
    sqsConfig.endpoint = "http://localhost:9324";
    sqsConfig.accessKeyId = "dummy";
    sqsConfig.secretAccessKey = "dummy";
  }
  const sqs = new AWS.SQS(sqsConfig);

  return sqs;
}

export async function enqueueJob(jobType: string, payload: any) {
  const sqs = await getSqs();
  const params: AWS.SQS.SendMessageRequest = {
    QueueUrl: config.getSqsQueueEndpoint(),
    MessageBody: JSON.stringify({ jobType, payload })
  };

  logger.debug(`Enqueuing job: ${jobType}`);

  const response = await sqs.sendMessage(params).promise();
  if (!response.MessageId) {
    throw new Error("Message was not enqueued.");
  }
  return response.MessageId;
}

export * from "./handlers/create-workflow-for-order";
export * from "./handlers/customer-created";
export * from "./handlers/order-created";
export * from "./handlers/vendor-created";
export * from "./handlers/workflow-created";
