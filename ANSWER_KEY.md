# ANSWER KEY — Facilitator Eyes Only

> **Do not share this file with participants until after the exercise.**

---

## Violation Summary

| #  | Violation                                  | File                                                    | Principle              | Difficulty |
| -- | ------------------------------------------ | ------------------------------------------------------- | ---------------------- | ---------- |
| 1  | `any` type on parameter                    | `src/application/services/job-service.ts`               | Code Style             | Easy       |
| 2  | `as` casting on `req.body`                 | `src/api/controllers/job-application-controller.ts`     | Code Style             | Easy       |
| 3  | HTTP error thrown in service layer          | `src/application/services/job-service.ts`               | Clean Architecture     | Medium     |
| 4  | Business logic in controller               | `src/api/controllers/job-controller.ts`                 | SRP / Clean Arch       | Medium     |
| 5  | Concrete infrastructure type in app layer  | `src/application/services/job-application-service.ts`   | Dependency Inversion   | Medium     |
| 6  | `.then()` chain instead of async/await     | `src/infrastructure/external/notification-client.ts`    | Code Style             | Easy       |
| 7  | Curried function                           | `src/application/formatters/job-formatter.ts`           | Code Style             | Easy       |
| 8  | Missing Zod validation on update endpoint  | `src/api/controllers/job-controller.ts`                 | Input Validation       | Medium     |
| 9  | Third-party type (`AxiosResponse`) in domain | `src/domain/ports/notification-port.ts`               | Clean Architecture     | Hard       |
| 10 | `index.ts` barrel file                     | `src/domain/models/index.ts`                            | Code Style             | Easy       |
| S  | Domain model imports from infrastructure   | `src/domain/models/job.ts`                              | Clean Arch (Dep. Rule) | **Sneaky** |

---

## Detailed Breakdown

### Violation 1 — `any` type on parameter

**File**: `src/application/services/job-service.ts`
**Line**: `const searchJobs = async (filters: any): Promise<Job[]>`
**Principle**: "Never use `any`, always create an appropriate type"
**Fix**: Define a `JobSearchFilters` interface:
```typescript
interface JobSearchFilters {
  location?: string;
  title?: string;
}
const searchJobs = async (filters: JobSearchFilters): Promise<Job[]> => { ... }
```

---

### Violation 2 — `as` casting on `req.body`

**File**: `src/api/controllers/job-application-controller.ts`
**Line**: `const body = req.body as CreateApplicationRequest;`
**Principle**: "Do not use casting, `as` should not be used"
**Fix**: Use Zod schema to parse and validate:
```typescript
const body = createApplicationSchema.parse(req.body);
```

---

### Violation 3 — HTTP error thrown in service layer

**File**: `src/application/services/job-service.ts`
**Lines**: `import { HttpError } from '../../api/middleware/error-handler';` and every `throw new HttpError(404, ...)`
**Principle**: "Do not throw HTTP errors outside of the API Controller"
**Fix**: Throw domain-specific errors instead:
```typescript
import { JobNotFoundError } from '../../domain/errors/job-not-found';
throw new JobNotFoundError(id);
```
The error-handler middleware already maps `JobNotFoundError` to HTTP 404.

---

### Violation 4 — Business logic in controller

**File**: `src/api/controllers/job-controller.ts`
**Lines**: The `listJobs` handler filters and sorts jobs inline:
```typescript
const filtered = allJobs
  .filter(...)
  .filter(...)
  .sort(...);
```
**Principle**: Single Responsibility / Clean Architecture — controllers should delegate to services
**Fix**: Move filtering and sorting into `jobService.searchJobs(filters)` (which already exists but isn't used here).

---

### Violation 5 — Concrete infrastructure type in application layer

**File**: `src/application/services/job-application-service.ts`
**Lines**:
```typescript
import { InMemoryJobRepository } from '../../infrastructure/repositories/in-memory-job-repository';
...
jobRepository: InMemoryJobRepository,
```
**Principle**: Dependency Inversion — the application layer should depend on the abstract `JobRepository` port, not the concrete `InMemoryJobRepository` from the infrastructure layer.
**Fix**: Change the parameter type to the port interface:
```typescript
import { JobRepository } from '../../domain/ports/job-repository';
...
jobRepository: JobRepository,
```
Also fix the import chain in `job-application-controller.ts` and `routes.ts` which propagate this concrete type.

---

### Violation 6 — `.then()` chain instead of async/await

**File**: `src/infrastructure/external/notification-client.ts`
**Lines**: The `send` method uses `.then().catch()` chaining:
```typescript
return axios
  .post(...)
  .then((response) => { ... })
  .catch((error) => { ... });
```
**Principle**: "Use async/await instead of .then()"
**Fix**:
```typescript
async send(email: string, message: string): Promise<AxiosResponse> {
  try {
    const response = await axios.post(...);
    console.log('Notification sent successfully', { status: response.status });
    return response;
  } catch (error) {
    console.error('Failed to send notification', { error: error.message });
    throw error;
  }
}
```

---

### Violation 7 — Curried function

**File**: `src/application/formatters/job-formatter.ts`
**Line**: `const formatJobForPlatform = (job: Job) => (platform: string): FormattedJob =>`
**Principle**: "Do not curry functions"
**Fix**:
```typescript
const formatJobForPlatform = (platform: string, job: Job): FormattedJob => { ... }
```

---

### Violation 8 — Missing Zod validation on update endpoint

**File**: `src/api/controllers/job-controller.ts`
**Lines**: The `updateJob` handler:
```typescript
const updates = req.body;  // No validation!
const job = await jobService.updateJob(req.params.id, updates);
```
**Principle**: "Validate all external input using Zod schemas"
**Fix**: Define an `updateJobSchema` and parse:
```typescript
const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  salary: z.number().positive().optional(),
});
const updates = updateJobSchema.parse(req.body);
```

---

### Violation 9 — Third-party type in domain port

**File**: `src/domain/ports/notification-port.ts`
**Lines**:
```typescript
import { AxiosResponse } from 'axios';

interface NotificationPort {
  send(email: string, message: string): Promise<AxiosResponse>;
}
```
**Principle**: "Don't use third-party library types directly in domain logic" — the domain layer should have zero knowledge of Axios.
**Fix**: Define an internal result type:
```typescript
interface NotificationResult {
  success: boolean;
  messageId?: string;
}

interface NotificationPort {
  send(email: string, message: string): Promise<NotificationResult>;
}
```

---

### Violation 10 — `index.ts` barrel file

**File**: `src/domain/models/index.ts`
**Principle**: "Do not use `index.ts` inside folders"
**Fix**: Delete the file. Import directly from the specific module:
```typescript
import { Job } from '../domain/models/job';
```

---

### SNEAKY Violation — Domain model imports from infrastructure

**File**: `src/domain/models/job.ts`
**Line**: `import { generateId } from '../../infrastructure/utils/id-generator';`
**Principle**: Clean Architecture dependency rule — the **domain layer must never depend on infrastructure**. Dependencies should only point inward.
**Why it's sneaky**: The import looks perfectly natural. `generateId()` is a small utility and the code works fine. Most developers won't think to trace the import path and realize it crosses an architectural boundary.
**Fix**: Either:
1. Accept the `id` as a parameter in `createJob()` and let the application layer generate it
2. Define an `IdGenerator` port interface in the domain and inject the implementation

---

## Scoring Cheat Sheet

- **Maximum standard score**: 20 points (10 violations x 2 for find + fix)
- **Bonus**: 1 point for finding the sneaky violation, +1 for fix = up to 2 bonus points
- **Theoretical max**: 22 points
