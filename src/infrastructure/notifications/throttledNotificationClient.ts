import { Clock } from '../../entities/gateways/clock';
import { LoggerGateway } from '../../entities/gateways/logger';
import { NotificationGateway } from '../../entities/gateways/notificationGateway';
import { createNotificationClient } from './notificationClient';

interface ThrottledNotificationClientDependencies {
  readonly inner?: NotificationGateway;
  readonly clock: Clock;
  readonly logger: LoggerGateway;
  readonly throttleLimit?: number;
  readonly windowMs?: number;
}

const DEFAULT_THROTTLE_LIMIT = 10;
const DEFAULT_WINDOW_MS = 1000;
const FALLBACK_NOTIFICATION_API_URL =
  process.env.NOTIFICATION_API_URL ?? 'http://localhost:3001';

const createThrottledNotificationClient = (
  deps: ThrottledNotificationClientDependencies,
): NotificationGateway => {
  const throttleLimit = deps.throttleLimit ?? DEFAULT_THROTTLE_LIMIT;
  const windowMs = deps.windowMs ?? DEFAULT_WINDOW_MS;
  const inner =
    deps.inner ??
    createNotificationClient({
      notificationApiUrl: FALLBACK_NOTIFICATION_API_URL,
      logger: deps.logger,
    });

  let sendCount = 0;
  let windowStart = deps.clock.now().getTime();

  const send = async (email: string, message: string): Promise<void> => {
    const now = deps.clock.now().getTime();
    if (now - windowStart > windowMs) {
      sendCount = 0;
      windowStart = now;
    }
    sendCount += 1;

    if (sendCount > throttleLimit) {
      deps.logger.warn('notification throttled', {
        activity: 'notificationThrottled',
        email,
        sendCount,
      });
      return;
    }

    await inner.send(email, message);
  };

  return { send };
};

export {
  createThrottledNotificationClient,
  ThrottledNotificationClientDependencies,
};
