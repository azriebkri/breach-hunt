interface NotificationGateway {
  send(email: string, message: string): Promise<void>;
}

export type { NotificationGateway };
