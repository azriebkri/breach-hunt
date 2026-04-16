import { randomUUID } from 'crypto';

const generateId = (): string => {
  return randomUUID();
};

export { generateId };
