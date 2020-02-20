import AWS from "aws-sdk";
import { JobHandler, getSqs } from "./";
import { getLogger } from "../../logger";

const logger = getLogger("sqs-worker");

interface SqsWorkerOptions {
  handlers: JobHandler<any>[];
}

export class SqsWorker {
  private readonly _sqs: AWS.SQS;
  private readonly _options: SqsWorkerOptions;
  private _isStopped: boolean = true;
  private _retryCount: number = 0;

  constructor(options: SqsWorkerOptions) {
    this._options = options;
    this._sqs = getSqs();
  }

  async start(queueUrl: string) {
    if (this._isStopped) {
      this._isStopped = false;
      this.poll(queueUrl);
    }
  }

  stop() {
    this._isStopped = true;
  }

  private async poll(queueUrl: string) {
    if (this._isStopped) {
      return;
    }
    const params: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20
    };
    try {
      const response = await this._sqs.receiveMessage(params).promise();
      this._retryCount = 0;
      if (response.Messages && response.Messages.length > 0) {
        await Promise.all(
          response.Messages.map(x => this.processMessage(queueUrl, x))
        );
      }
      this.poll(queueUrl);
    } catch (e) {
      logger.error(
        `Error while polling SQS (Retry Count: ${this._retryCount})`,
        e
      );
      if (this._retryCount >= 5) {
        logger.error("Killing process after 5 consecutive errors.");
        process.exit(1);
      }
      this._retryCount++;
      setTimeout(() => {
        this.poll(queueUrl);
      }, 3000);
    }
  }

  private async processMessage(queueUrl: string, message: AWS.SQS.Message) {
    let messageBody: any;
    try {
      if (!message.Body || message.Body.length === 0) {
        throw new Error("Empty SQS Message");
      }
      messageBody = JSON.parse(message.Body);
    } catch (e) {
      logger.error(`SQS Message was invalid.`, { message, e });
      await this.deleteMessage(queueUrl, message);
    }
    try {
      if (!messageBody.jobType) {
        return await this.deleteMessage(queueUrl, message);
      }
      const matchingJobHandler = this._options.handlers.find(
        x => x.jobName === messageBody.jobType
      );
      if (!matchingJobHandler) {
        await this.deleteMessage(queueUrl, message);
        return;
      }
      await matchingJobHandler.process(messageBody.payload || null);
      await this.deleteMessage(queueUrl, message);
    } catch (e) {
      logger.error(`Error processing SQS message`, { message, e });
      if (process.env.NODE_ENV === "development") {
        await this.deleteMessage(queueUrl, message);
      }
    }
  }

  private async deleteMessage(queueUrl: string, message: AWS.SQS.Message) {
    if (!message.ReceiptHandle) {
      logger.error("Undefined receipt handle", { message });
      return;
    }
    try {
      const params: AWS.SQS.DeleteMessageRequest = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle
      };
      await this._sqs.deleteMessage(params).promise();
      // logger.debug(`Message ${message.MessageId} was deleted successfully.`);
    } catch (e) {
      logger.error("Error deleting SQS message", { e });
    }
  }
}
