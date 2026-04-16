import request from 'supertest';
import express from 'express';
import { createRoutes } from '../../src/api/routes';
import { errorHandler } from '../../src/api/middleware/error-handler';
import { InMemoryJobRepository } from '../../src/infrastructure/repositories/in-memory-job-repository';
import { InMemoryJobApplicationRepository } from '../../src/infrastructure/repositories/in-memory-job-application-repository';
import { NotificationPort } from '../../src/domain/ports/notification-port';

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const jobRepository = new InMemoryJobRepository();
  const applicationRepository = new InMemoryJobApplicationRepository();
  const notificationPort: NotificationPort = {
    send: jest.fn().mockResolvedValue({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} }),
  };

  const routes = createRoutes({ jobRepository, applicationRepository, notificationPort });
  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};

describe('Job API', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/jobs', () => {
    it('should create a new job posting', async () => {
      const response = await request(app)
        .post('/api/jobs')
        .send({
          title: 'Backend Developer',
          description: 'Build APIs',
          company: 'SEEK',
          location: 'Melbourne',
          salary: 130000,
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Backend Developer');
      expect(response.body.company).toBe('SEEK');
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for invalid job data', async () => {
      const response = await request(app)
        .post('/api/jobs')
        .send({
          title: '',
          description: 'Build APIs',
          company: 'SEEK',
          location: 'Melbourne',
          salary: -1,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/jobs', () => {
    it('should return an empty list when no jobs exist', async () => {
      const response = await request(app).get('/api/jobs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return created jobs', async () => {
      await request(app).post('/api/jobs').send({
        title: 'DevOps Engineer',
        description: 'Manage infrastructure',
        company: 'SEEK',
        location: 'Sydney',
        salary: 145000,
      });

      const response = await request(app).get('/api/jobs');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('DevOps Engineer');
    });

    it('should filter jobs by location', async () => {
      await request(app).post('/api/jobs').send({
        title: 'Engineer A',
        description: 'Work',
        company: 'SEEK',
        location: 'Melbourne',
        salary: 120000,
      });
      await request(app).post('/api/jobs').send({
        title: 'Engineer B',
        description: 'Work',
        company: 'SEEK',
        location: 'Sydney',
        salary: 125000,
      });

      const response = await request(app).get('/api/jobs?location=Melbourne');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].location).toBe('Melbourne');
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should return a specific job', async () => {
      const createRes = await request(app).post('/api/jobs').send({
        title: 'QA Engineer',
        description: 'Test everything',
        company: 'SEEK',
        location: 'Brisbane',
        salary: 115000,
      });

      const response = await request(app).get(`/api/jobs/${createRes.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('QA Engineer');
    });

    it('should return 404 for a non-existent job', async () => {
      const response = await request(app).get('/api/jobs/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('should update a job posting', async () => {
      const createRes = await request(app).post('/api/jobs').send({
        title: 'Junior Dev',
        description: 'Learn things',
        company: 'SEEK',
        location: 'Melbourne',
        salary: 80000,
      });

      const response = await request(app)
        .put(`/api/jobs/${createRes.body.id}`)
        .send({ title: 'Mid-Level Dev', salary: 110000 });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Mid-Level Dev');
      expect(response.body.salary).toBe(110000);
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete a job posting', async () => {
      const createRes = await request(app).post('/api/jobs').send({
        title: 'Temp Role',
        description: 'Short contract',
        company: 'SEEK',
        location: 'Perth',
        salary: 100000,
      });

      const deleteRes = await request(app).delete(`/api/jobs/${createRes.body.id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/api/jobs/${createRes.body.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
