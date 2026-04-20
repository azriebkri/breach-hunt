import { randomUUID } from 'crypto';

const generateId = (): string => randomUUID();

export { generateId };
