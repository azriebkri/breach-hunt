import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.number().positive('Salary must be positive'),
});

type CreateJobRequest = z.infer<typeof createJobSchema>;

export { createJobSchema, CreateJobRequest };
