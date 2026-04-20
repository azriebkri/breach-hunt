import express, { Express } from 'express';
import { errorHandler } from './middleware/errorHandlerMiddleware';
import { createRouter, RouterDependencies } from './router';

const createServer = (deps: RouterDependencies): Express => {
  const app = express();
  app.use(express.json());
  app.use('/api', createRouter(deps));
  app.use(errorHandler);
  return app;
};

export { createServer };
