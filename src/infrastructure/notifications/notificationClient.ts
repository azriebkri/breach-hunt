import axios from 'axios';
import { LoggerGateway } from '../../entities/gateways/logger';
import { NotificationGateway } from '../../entities/gateways/notificationGateway';

interface NotificationClientDependencies {
  readonly notificationApiUrl: string;
  readonly logger: LoggerGateway;
}

const createNotificationClient = (
  deps: NotificationClientDependencies,
): NotificationGateway => {
  const send = async (email: string, message: string): Promise<void> => {
    try {
      const response = await axios.post(`${deps.notificationApiUrl}/api/notify`, {
        email,
        message,
      });
      deps.logger.info('notification sent successfully', {
        activity: 'notificationSent',
        status: response.status,
      });
    } catch (error) {
      deps.logger.error('failed to send notification', {
        activity: 'notificationFailed',
        reason: (error as Error).message,
      });
      throw error;
    }
  };

  return { send };
};

export { createNotificationClient, NotificationClientDependencies };
