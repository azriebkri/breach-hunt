interface Config {
  readonly port: number;
  readonly notificationApiUrl: string;
  readonly auditUrl: string;
}

const loadConfig = (): Config => ({
  port: Number(process.env.PORT ?? 3000),
  notificationApiUrl:
    process.env.NOTIFICATION_API_URL ?? 'http://localhost:3001',
  auditUrl: process.env.AUDIT_URL ?? 'http://localhost:9999/audit/events',
});

const config: Config = loadConfig();

export { Config, config, loadConfig };
