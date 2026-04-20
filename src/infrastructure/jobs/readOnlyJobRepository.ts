import { createInMemoryJobRepository } from './inMemoryJobRepository';

const createReadOnlyJobRepository = () => {
  const inner = createInMemoryJobRepository();

  const reject = (operation: string): never => {
    throw new Error(`Read-only mode: ${operation} is not supported`);
  };

  return {
    ...inner,
    save: async () => reject('save'),
    update: async () => reject('update'),
    remove: async () => reject('remove'),
    saveFromRequest: async () => reject('saveFromRequest'),
  };
};

export { createReadOnlyJobRepository };
