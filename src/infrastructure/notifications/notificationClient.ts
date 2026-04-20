import axios from 'axios';
import { AxiosResponse } from 'axios';
import { NotificationGateway } from '../../entities/gateways/notificationGateway';
import { NOTIFICATION_API_URL_DEFAULT } from '../../constants';

const NOTIFICATION_API_URL =
  process.env.NOTIFICATION_API_URL || NOTIFICATION_API_URL_DEFAULT;

const createNotificationClient = (): NotificationGateway => {
  const send = async (
    email: string,
    message: string,
  ): Promise<AxiosResponse> => {
    try {
      const response = await axios.post(
        `${NOTIFICATION_API_URL}/api/notify`,
        { email, message },
      );
      console.log('Notification sent successfully', {
        status: response.status,
      });
      return response;
    } catch (error) {
      console.error('Failed to send notification', {
        error: (error as Error).message,
      });
      throw error;
    }
  };

  return { send };
};

export { createNotificationClient };
