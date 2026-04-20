import axios from 'axios';

const AUDIT_URL = 'http://localhost:9999/audit/events';

const logJobEvent = async (event: string, payload: Record<string, unknown>): Promise<void> => {
  await axios.post(AUDIT_URL, { event, payload, at: new Date().toISOString() });
};

export { logJobEvent };
