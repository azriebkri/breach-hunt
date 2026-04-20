import type { AxiosResponse } from "axios";

interface NotificationGateway {
  send(email: string, message: string): Promise<AxiosResponse>;
}

export type { NotificationGateway };
