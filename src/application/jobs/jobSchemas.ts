import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.number().positive('Salary must be positive'),
});

const updateJobSchema = createJobSchema.partial();

type CreateJobRequest = z.infer<typeof createJobSchema>;
type UpdateJobRequest = z.infer<typeof updateJobSchema>;

export { createJobSchema, updateJobSchema, CreateJobRequest, UpdateJobRequest };
