export type SQSMessage = {
  body: any,
  handle: string,
  delete: (handle: string) => Promise<void>;
};
