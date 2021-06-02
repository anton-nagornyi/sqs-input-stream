import { Worker } from 'worker_threads';
import { AWSSqsConfig } from './AWSSqsConfig';

let pollWorker: Worker;
let queue: string;

/** @internal */
export const deleteMessage = (handle: string) => {
  if (!pollWorker) {
    return;
  }
  pollWorker.postMessage({
    type: 'delete',
    queue,
    handle,
  });
};

/** @internal */
export const setWorkerInstance = (instance: Worker, conf: AWSSqsConfig) => {
  pollWorker = instance;
  queue = conf.queueUrl;
};
