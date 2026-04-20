import axios from 'axios';
import { AxiosResponse } from 'axios';
import { NotificationPort } from '../../entities/ports/notificationPort';
import { NOTIFICATION_API_URL_DEFAULT } from '../../constants';

const NOTIFICATION_API_URL =
  process.env.NOTIFICATION_API_URL || NOTIFICATION_API_URL_DEFAULT;

const createNotificationClient = (): NotificationPort => {
  const send = (email: string, message: string): Promise<AxiosResponse> => {
    return axios
      .post(`${NOTIFICATION_API_URL}/api/notify`, { email, message })
      .then((response) => {
        console.log('Notification sent successfully', {
          status: response.status,
        });
        return response;
      })
      .catch((error) => {
        console.error('Failed to send notification', {
          error: error.message,
        });
        throw error;
      });
  };

  return { send };
};

export { createNotificationClient };
