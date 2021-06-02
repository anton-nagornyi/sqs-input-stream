import { SQSClientConfig } from '@aws-sdk/client-sqs/SQSClient';

export type AWSSqsConfig = {
  pollingTimeout?: number;
  queueUrl: string;
  batchSize?: number;
  visibilityTimeout?: number;
  sqsClientConfig?: SQSClientConfig;
  logger?: string
};

export type AWASqsConfigRequired = Required<AWSSqsConfig>;
