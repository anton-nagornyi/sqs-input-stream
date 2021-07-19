import { Transform } from 'stream';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { SQSClientConfig } from '@aws-sdk/client-sqs/SQSClient';
import { SQSMessage } from './SQSMessage';
import { AWASqsConfigRequired, AWSSqsConfig } from './AWSSqsConfig';
import { setWorkerInstance } from './workerHelpers';

export class SqsInputStream extends Transform {
  constructor(config: AWSSqsConfig) {
    super({
      objectMode: true,
    });

    this.conf = {
      queueUrl: config.queueUrl,
      pollingTimeout: config.pollingTimeout || 2,
      batchSize: config.batchSize || 1,
      visibilityTimeout: config.visibilityTimeout || 1,
      sqsClientConfig: config.sqsClientConfig || {},
      logger: config.logger || '',
      region: config.region,
    };

    this.poll = new Worker(this.getWorkerPath(), { workerData: this.conf });

    setWorkerInstance(this.poll, this.conf);

    this.poll.on('message', (message: SQSMessage) => {
      this.push(message);
    });
  }

  private readonly poll: Worker;

  private readonly conf: AWASqsConfigRequired;

  static readConfig = (envPrefix = 'SQS', sqsClientConfig?: SQSClientConfig, logger?: string): AWSSqsConfig => {
    const config: AWSSqsConfig = {
      sqsClientConfig: sqsClientConfig || {},
      logger,
    } as any;
    const env = {
      SQS_URL: `${envPrefix}_URL`,
      SQS_BATCH_SIZE: `${envPrefix}_BATCH_SIZE`,
      SQS_VISIBILITY_TIMEOUT: `${envPrefix}_VISIBILITY_TIMEOUT`,
      SQS_POLLING_TIMEOUT_MS: `${envPrefix}_POLLING_TIMEOUT_MS`,
      SQS_REGION: `${envPrefix}_REGION`,
    };

    if (!process.env[env.SQS_URL]) {
      throw new Error(`process.env.${env.SQS_URL} must be set`);
    }
    config.queueUrl = process.env[env.SQS_URL]!;
    if (process.env[env.SQS_BATCH_SIZE]) {
      config.batchSize = parseInt(process.env[env.SQS_BATCH_SIZE]!, 10);
    }
    if (process.env[env.SQS_VISIBILITY_TIMEOUT]) {
      config.visibilityTimeout = parseInt(process.env[env.SQS_VISIBILITY_TIMEOUT]!, 10);
    }

    if (process.env[env.SQS_POLLING_TIMEOUT_MS]) {
      config.pollingTimeout = parseInt(process.env[env.SQS_POLLING_TIMEOUT_MS]!, 10);
    }

    if (process.env[env.SQS_REGION]) {
      config.region = process.env[env.SQS_REGION];
    }
    return config;
  };

  private getWorkerPath = (): string => {
    if (__filename.endsWith('.ts')) {
      return path.join(__dirname, '../dist/pollWorker.js');
    }
    return path.join(__dirname, 'pollWorker.js');
  };
}
