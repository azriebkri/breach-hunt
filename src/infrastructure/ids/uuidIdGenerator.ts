import { randomUUID } from 'crypto';
import { IdGenerator } from '../../entities/gateways/idGenerator';

const createUuidIdGenerator = (): IdGenerator => ({
  next: () => randomUUID(),
});

export { createUuidIdGenerator };
