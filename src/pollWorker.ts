import {
  DeleteMessageCommand,
  Message, ReceiveMessageCommand, SQSClient,
} from '@aws-sdk/client-sqs';
import { parentPort, workerData } from 'worker_threads';
import { SQSMessage } from './SQSMessage';
import { AWASqsConfigRequired } from './AWSSqsConfig';
import { getLogger } from './logger';

const conf = workerData as AWASqsConfigRequired;
const log = getLogger(conf.logger);
const client = new SQSClient(conf.sqsClientConfig);
const { queueUrl } = conf;

let { pollingTimeout } = conf;

parentPort!.on('message', async (message: { type: 'delete', queue: string, handle: string }) => {
  const {
    type, queue, handle,
  } = message;

  if (type === 'delete') {
    try {
      await client.send(new DeleteMessageCommand({
        QueueUrl: queue,
        ReceiptHandle: handle,
      }));
    } catch (e) {
      log.error(e.message, e.stack);
    }
  }
});

const processMessage = async (message: Message) => {
  if (!message.Body) return;

  const body = JSON.parse(message.Body);
  parentPort!.postMessage({
    body,
    handle: message.ReceiptHandle,
  } as SQSMessage);
};

const poll = async () => {
  try {
    const result = await client.send(new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: conf.batchSize,
      VisibilityTimeout: conf.visibilityTimeout,
      WaitTimeSeconds: conf.pollingTimeout,
    }));

    pollingTimeout = 0;

    if (result.Messages) {
      for (const message of result.Messages) {
        processMessage(message);
      }
    }
  } catch (e) {
    // Exception may occur while connecting and reading from AWS. Wait 10 sec before the next attempt
    pollingTimeout = 10000;
    log.error(e.message, e.stack);
  }

  setTimeout(poll, pollingTimeout);
};

poll();
