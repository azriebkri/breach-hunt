import axios from 'axios';
import { AUDIT_URL_DEFAULT } from '../../constants';

const AUDIT_URL = AUDIT_URL_DEFAULT;

const auditJobEvent = async (
  event: string,
  payload: Record<string, unknown>,
): Promise<void> => {
  await axios.post(AUDIT_URL, {
    event,
    payload,
    at: new Date().toISOString(),
  });
};

export { auditJobEvent };
