interface AuditGateway {
  publish(event: string, payload: Record<string, unknown>): Promise<void>;
}

export type { AuditGateway };
