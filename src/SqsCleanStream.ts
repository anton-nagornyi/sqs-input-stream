import { Transform, TransformCallback } from 'stream';
import { SQSMessage } from './SQSMessage';
import { deleteMessage } from './workerHelpers';

export class SqsCleanStream extends Transform {
  constructor() {
    super({
      objectMode: true,
    });
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(message: SQSMessage, encoding: BufferEncoding, next: TransformCallback): void {
    deleteMessage(message.handle);
    next(null, message);
  }
}
