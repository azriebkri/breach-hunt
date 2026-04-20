import { AxiosResponse } from 'axios';

interface NotificationPort {
  send(email: string, message: string): Promise<AxiosResponse>;
}

export { NotificationPort };
