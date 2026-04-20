interface LogContext {
  readonly activity: string;
  readonly [key: string]: unknown;
}

interface LoggerGateway {
  info(message: string, context: LogContext): void;
  warn(message: string, context: LogContext): void;
  error(message: string, context: LogContext): void;
}

export type { LoggerGateway, LogContext };
