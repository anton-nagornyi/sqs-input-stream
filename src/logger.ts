export interface ILogger {
  error: (message: string, stack?: any) => void;
}

export const getLogger = (module: string): ILogger => {
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const { default: logger } = require(module);
    return logger('SQS Stream');
  } catch (e) {
    console.error(e);
    return {
      error: (message: string, stack?: any) => console.error(message, stack),
    };
  }
};
