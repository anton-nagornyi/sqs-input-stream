# sqs-input-stream

Provides streams to read from AWS SQS in a separate thread.

## Install:

```shell script
npm install --save-dev sqs-input-stream
```

## Use:

```typescript
const input = new SqsInputStream({
  // [Optional] Path to a custom logger module. It must export the default function
  // (name: string) => ({
  //    error: (message: string, stack: any) => void
  // })
  // By default console.error is used
  logger: './dummyLogger',
  queueUrl: 'https://sqs.<region>.amazonaws.com/<id>/<queue_name>',
  // [Optional] The duration (in seconds) for which the call waits for a message to arrive in the queue before returning. If a message is available, the call returns sooner than pollingTimeout. Valid values greater zero. Default: 2. 
  pollingTimeout: 2,
  // [Optional] The maximum number of messages to return. Amazon SQS never returns more messages than this value (however, fewer messages might be returned). Valid values: 1 to 10. Default: 1.
  batchSize: 1, 
  // [Optional] SQS client configuration. In case it is not set, SQS client will try to read creds from environment variables.
  sqsClientConfig: {
    region: 'eu-central-1',
    credentials: {
      accessKeyId: 'xxxxxxxxxxxxxxxxxxxx', 
      secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  },
  // [Optional] The duration (in seconds) that the received messages are hidden from subsequent retrieve requests after being retrieved. Default is 1 second.
  visibilityTimeout: 2,
});

pipeline(input, new LogStream(), new SqsCleanStream(), (err) => console.error(err));

```
