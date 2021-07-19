import { SQSClientConfig } from '@aws-sdk/client-sqs/SQSClient';

type BaseAWSSqsConfig = {
  pollingTimeout?: number;
  queueUrl: string;
  batchSize?: number;
  visibilityTimeout?: number;
  sqsClientConfig?: SQSClientConfig;
  logger?: string
};

export type AWSSqsConfig = BaseAWSSqsConfig & { region?: string };

export type AWASqsConfigRequired = { region?: string } & Required<BaseAWSSqsConfig>;
