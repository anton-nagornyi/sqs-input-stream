import { pipeline } from 'stream';
import { SqsInputStream } from '../src/SqsInputStream';
import { SqsCleanStream } from '../src/SqsCleanStream';
import { LogStream } from './LogStream';

const input = new SqsInputStream({
  logger: './dummyLogger',
  queueUrl: 'https://sqs.eu-central-1.amazonaws.com/000000000000/TEST',
  sqsClientConfig: {
    region: 'eu-central-1',
    credentials: {
      accessKeyId: 'xxxxxxxxxxxxxxxxxxxx',
      secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  },
});

pipeline(input, new LogStream(), new SqsCleanStream(), (err) => console.error(err));
