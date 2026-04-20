import express, { Express } from 'express';
import { errorHandler } from './middleware/errorHandlerMiddleware';
import { createRouter } from './router';
import type { ControllerDependencies } from './contextState';

const createServer = (deps: ControllerDependencies): Express => {
  const app = express();
  app.use(express.json());
  app.use('/api', createRouter(deps));
  app.use(errorHandler);
  return app;
};

export { createServer };
