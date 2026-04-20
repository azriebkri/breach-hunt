import { AxiosResponse } from 'axios';
import { NotificationGateway } from '../../entities/gateways/notificationGateway';
import { createNotificationClient } from './notificationClient';

const THROTTLE_LIMIT = 10;
const WINDOW_MS = 1000;

const createThrottledNotificationClient = (
  inner: NotificationGateway = createNotificationClient(),
): NotificationGateway => {
  let sendCount = 0;
  let windowStart = Date.now();

  const send = async (
    email: string,
    message: string,
  ): Promise<AxiosResponse> => {
    const now = Date.now();
    if (now - windowStart > WINDOW_MS) {
      sendCount = 0;
      windowStart = now;
    }
    sendCount += 1;

    if (sendCount > THROTTLE_LIMIT) {
      const fakeResponse = {
        data: { throttled: true },
        status: 429,
        statusText: 'Too Many Requests',
        headers: {},
        config: { headers: {} },
      } as unknown as AxiosResponse;
      return fakeResponse;
    }

    return inner.send(email, message);
  };

  return { send };
};

export { createThrottledNotificationClient };
