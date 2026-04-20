import request from 'supertest';
import express from 'express';
import { createRoutes } from '../../src/api/routes';
import { errorHandler } from '../../src/api/middleware/error-handler';
import { createInMemoryJobRepository } from '../../src/infrastructure/repositories/in-memory-job-repository';
import { createInMemoryJobApplicationRepository } from '../../src/infrastructure/repositories/in-memory-job-application-repository';
import { NotificationPort } from '../../src/domain/ports/notification-port';

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const jobRepository = createInMemoryJobRepository();
  const applicationRepository = createInMemoryJobApplicationRepository();
  const notificationPort: NotificationPort = {
    send: jest.fn().mockResolvedValue({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }),
  };

  const routes = createRoutes({ jobRepository, applicationRepository, notificationPort });
  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};

describe('Job Application API', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/jobs/:id/applications', () => {
    it('should submit an application to a job', async () => {
      const jobRes = await request(app).post('/api/jobs').send({
        title: 'Data Analyst',
        description: 'Analyze data',
        company: 'SEEK',
        location: 'Melbourne',
        salary: 110000,
      });

      const response = await request(app)
        .post(`/api/jobs/${jobRes.body.id}/applications`)
        .send({
          applicantName: 'Bob Smith',
          applicantEmail: 'bob@example.com',
          coverLetter: 'I love data!',
        });

      expect(response.status).toBe(201);
      expect(response.body.applicantName).toBe('Bob Smith');
      expect(response.body.jobId).toBe(jobRes.body.id);
    });
  });

  describe('GET /api/jobs/:id/applications', () => {
    it('should return applications for a job', async () => {
      const jobRes = await request(app).post('/api/jobs').send({
        title: 'UX Designer',
        description: 'Design things',
        company: 'SEEK',
        location: 'Sydney',
        salary: 125000,
      });

      await request(app)
        .post(`/api/jobs/${jobRes.body.id}/applications`)
        .send({
          applicantName: 'Alice Brown',
          applicantEmail: 'alice@example.com',
          coverLetter: 'I have a great portfolio',
        });

      const response = await request(app).get(`/api/jobs/${jobRes.body.id}/applications`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].applicantName).toBe('Alice Brown');
    });

    it('should return empty list when no applications exist', async () => {
      const jobRes = await request(app).post('/api/jobs').send({
        title: 'PM',
        description: 'Manage products',
        company: 'SEEK',
        location: 'Melbourne',
        salary: 140000,
      });

      const response = await request(app).get(`/api/jobs/${jobRes.body.id}/applications`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
