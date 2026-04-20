interface Config {
  readonly port: number;
  readonly notificationApiUrl: string;
  readonly auditUrl: string;
  readonly maxSalary?: number;
  readonly highSalaryThreshold: number;
  readonly notificationsEnabled: boolean;
  readonly notificationRetries: number;
}

const DEFAULT_HIGH_SALARY_THRESHOLD = 100000;

const parseOptionalNumber = (raw: string | undefined): number | undefined => {
  if (raw === undefined) {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const loadConfig = (): Config => ({
  port: Number(process.env.PORT ?? 3000),
  notificationApiUrl:
    process.env.NOTIFICATION_API_URL ?? 'http://localhost:3001',
  auditUrl: process.env.AUDIT_URL ?? 'http://localhost:9999/audit/events',
  maxSalary: parseOptionalNumber(process.env.MAX_SALARY),
  highSalaryThreshold:
    parseOptionalNumber(process.env.HIGH_SALARY_THRESHOLD) ??
    DEFAULT_HIGH_SALARY_THRESHOLD,
  notificationsEnabled: process.env.NOTIFICATION_ENABLED !== 'false',
  notificationRetries:
    parseOptionalNumber(process.env.NOTIFICATION_RETRIES) ?? 1,
});

export { Config, loadConfig };
