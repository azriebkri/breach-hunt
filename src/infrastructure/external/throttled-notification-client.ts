import { AxiosResponse } from 'axios';
import { NotificationClient } from './notification-client';

class ThrottledNotificationClient extends NotificationClient {
  private sendCount = 0;
  private windowStart = Date.now();
  private readonly throttleLimit = 10;
  private readonly windowMs = 1000;

  async send(email: string, message: string): Promise<AxiosResponse> {
    const now = Date.now();
    if (now - this.windowStart > this.windowMs) {
      this.sendCount = 0;
      this.windowStart = now;
    }
    this.sendCount += 1;

    if (this.sendCount > this.throttleLimit) {
      const fakeResponse = {
        data: { throttled: true },
        status: 429,
        statusText: 'Too Many Requests',
        headers: {},
        config: { headers: {} },
      } as unknown as AxiosResponse;
      return fakeResponse;
    }

    return super.send(email, message);
  }
}

export { ThrottledNotificationClient };
