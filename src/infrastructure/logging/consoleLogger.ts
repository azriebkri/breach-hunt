import { LogContext, LoggerGateway } from '../../entities/gateways/logger';

const createConsoleLogger = (): LoggerGateway => {
  const info = (message: string, context: LogContext): void => {
    console.log(message, context);
  };

  const warn = (message: string, context: LogContext): void => {
    console.warn(message, context);
  };

  const error = (message: string, context: LogContext): void => {
    console.error(message, context);
  };

  return { info, warn, error };
};

export { createConsoleLogger };
