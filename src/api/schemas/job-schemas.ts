import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.number().positive('Salary must be positive'),
});

const createApplicationSchema = z.object({
  applicantName: z.string().min(1, 'Applicant name is required'),
  applicantEmail: z.string().email('Valid email is required'),
  coverLetter: z.string().min(1, 'Cover letter is required'),
});

type CreateJobRequest = z.infer<typeof createJobSchema>;
type CreateApplicationRequest = z.infer<typeof createApplicationSchema>;

export { createJobSchema, createApplicationSchema, CreateJobRequest, CreateApplicationRequest };
