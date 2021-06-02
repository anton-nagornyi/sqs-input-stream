import { Transform, TransformCallback } from 'stream';
import { SQSMessage } from '../src/SQSMessage';

export class LogStream extends Transform {
  constructor() {
    super({
      objectMode: true,
    });
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(message: SQSMessage, encoding: BufferEncoding, next: TransformCallback): void {
    console.log(message);
    next(null, message);
  }
}
