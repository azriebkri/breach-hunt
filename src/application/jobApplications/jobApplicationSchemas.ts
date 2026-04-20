import { z } from 'zod';

const createApplicationSchema = z.object({
  applicantName: z.string().min(1, 'Applicant name is required'),
  applicantEmail: z.string().email('Valid email is required'),
  coverLetter: z.string().min(1, 'Cover letter is required'),
});

type CreateApplicationRequest = z.infer<typeof createApplicationSchema>;

export { createApplicationSchema, CreateApplicationRequest };
