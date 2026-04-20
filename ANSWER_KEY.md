# ANSWER KEY — Facilitator Eyes Only

> **Do not share this file with participants until after the exercise.**

---

## Violation Summary

| #   | Violation                                         | File                                                      | Category             | Difficulty |
| --- | ------------------------------------------------- | --------------------------------------------------------- | -------------------- | ---------- |
| 1   | `any` type on parameter                           | `src/application/services/job-service.ts`                 | Code Style           | Easy       |
| 2   | `as` casting on `req.body`                        | `src/api/controllers/job-application-controller.ts`       | Code Style           | Easy       |
| 3   | HTTP error thrown in service layer                | `src/application/services/job-service.ts`                 | Clean Arch / Layer   | Medium     |
| 4   | Business logic in controller                      | `src/api/controllers/job-controller.ts`                   | SRP / Clean Arch     | Medium     |
| 5   | Concrete infrastructure type in app layer         | `src/application/services/job-application-service.ts`     | Clean Arch / DIP     | Medium     |
| 6   | `.then()` chain instead of async/await            | `src/infrastructure/external/notification-client.ts`      | Code Style           | Easy       |
| 7   | Curried function                                  | `src/application/formatters/job-formatter.ts`             | Code Style           | Easy       |
| 8   | Missing Zod validation on update endpoint         | `src/api/controllers/job-controller.ts`                   | Input Validation     | Medium     |
| 9   | Third-party type (`AxiosResponse`) in domain port | `src/domain/ports/notification-port.ts`                   | Clean Arch / Leak    | Hard       |
| 10  | `index.ts` barrel file                            | `src/domain/models/index.ts`                              | Code Style           | Easy       |
| L1  | Infrastructure imports API schema                 | `src/infrastructure/repositories/in-memory-job-repository.ts` | Clean Arch / Layer | Medium     |
| L2  | Controller bypasses service, calls repo directly  | `src/api/controllers/job-controller.ts`                   | Clean Arch / Layer   | Medium     |
| L3  | Domain error extends API `HttpError`              | `src/domain/errors/job-not-found.ts`                      | Clean Arch / Layer   | Easy       |
| L4  | Application service accepts Express `Request`     | `src/application/services/job-service.ts`                 | Clean Arch / Leak    | Hard       |
| D1  | Service instantiates concrete `NotificationClient`| `src/application/services/job-application-service.ts`     | Clean Arch / DIP     | Medium     |
| D2  | Direct `axios` call from application layer        | `src/application/services/audit-service.ts`               | Clean Arch / DIP     | Hard       |
| D3  | Domain reads `process.env`                        | `src/domain/models/job.ts`                                | Clean Arch / Config  | Hard       |
| X1  | `console.log` instead of a `Logger` port          | `src/application/services/job-service.ts`, `src/domain/models/job.ts` | Clean Arch / DIP | Easy |
| X2  | API-layer Zod schema imported into application    | `src/application/services/job-service.ts`                 | Clean Arch / Layer   | Medium     |
| X3  | Business logic inside repository (and on port)    | `src/infrastructure/repositories/in-memory-job-repository.ts`, `src/domain/ports/job-repository.ts` | Clean Arch / SRP | Medium |
| S   | Domain model imports from infrastructure          | `src/domain/models/job.ts`                                | Clean Arch / Layer   | **Sneaky** |

---

## Category distribution

| Category                        | Count | Items                                      |
| ------------------------------- | ----- | ------------------------------------------ |
| Clean Architecture — layering   | 7     | #3, #9, L1, L2, L3, X2, S                  |
| Clean Architecture — DIP        | 4     | #5, D1, D2, X1                             |
| Clean Architecture — leak/cfg   | 2     | L4, D3                                     |
| Clean Architecture — SRP        | 2     | #4, X3                                     |
| Code Style                      | 5     | #1, #2, #6, #7, #10                        |
| Input Validation                | 1     | #8                                         |

**Clean Architecture total: 15 / 21 (≈71%) — clear majority, spread across every layer.**

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
**Fix**: Use the existing Zod schema to parse and validate:

```typescript
const body = createApplicationSchema.parse(req.body);
```

---

### Violation 3 — HTTP error thrown in service layer

**File**: `src/application/services/job-service.ts`
**Lines**: `import { HttpError } from '../../api/middleware/error-handler';` and every `throw new HttpError(404, ...)`
**Principle**: "Do not throw HTTP errors outside of the API Controller"
**Fix**: Throw domain-specific errors and let the error handler map them:

```typescript
import { JobNotFoundError } from '../../domain/errors/job-not-found';
throw new JobNotFoundError(id);
```

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

**Principle**: Single Responsibility / Clean Architecture — controllers should delegate to services.
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

**Principle**: Dependency Inversion — the application layer should depend on the abstract `JobRepository` port.
**Fix**: Change the parameter type to the port interface:

```typescript
import { JobRepository } from '../../domain/ports/job-repository';
...
jobRepository: JobRepository,
```

Propagate the change in `job-application-controller.ts` and `routes.ts` which carry the concrete type too.

---

### Violation 6 — `.then()` chain instead of async/await

**File**: `src/infrastructure/external/notification-client.ts`
**Fix**:

```typescript
async send(email: string, message: string): Promise<AxiosResponse> {
  try {
    const response = await axios.post(`${NOTIFICATION_API_URL}/api/notify`, { email, message });
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
**Principle**: "Don't use third-party library types directly in domain logic".
**Fix**: Replace `AxiosResponse` with an internal domain result type.

---

### Violation 10 — `index.ts` barrel file

**File**: `src/domain/models/index.ts`
**Fix**: Delete the file. Import directly from specific modules.

---

### Violation L1 — Infrastructure imports from API layer

**File**: `src/infrastructure/repositories/in-memory-job-repository.ts`
**Line**: `import { CreateJobRequest } from '../../api/schemas/job-schemas';` and the `saveFromRequest(id, request)` method.
**Principle**: Dependency rule — infrastructure is an outer layer, API is also outer; one outer layer must not depend on another. Repositories should speak only `domain` types.
**Fix**: Drop the API import; accept a fully-formed `Job` (or a domain-defined input DTO):

```typescript
async saveFromRequest(id: string, input: JobInput): Promise<Job> { ... }
```

Or simply remove the convenience method and let the service build the `Job` and call `save()`.

---

### Violation L2 — Controller bypasses service, calls repository directly

**File**: `src/api/controllers/job-controller.ts`
**Lines**: `getJobsByCompany` and `getFeaturedJobs` both call `jobRepository.findAll()` / `jobRepository.findActiveHighPayingJobs()` directly, skipping `jobService`.
**Principle**: Clean Architecture — controllers are thin adapters that delegate to use cases; they must not reach into infrastructure ports.
**Fix**: Add `jobService.getJobsByCompany(company)` and `jobService.getFeaturedJobs()` and delegate. The controller then only parses input and formats the response.

---

### Violation L3 — Domain error extends API `HttpError`

**File**: `src/domain/errors/job-not-found.ts`
**Line**: `class JobNotFoundError extends HttpError` with `import { HttpError } from '../../api/middleware/error-handler';`
**Principle**: Dependency rule — domain is the innermost layer and must not know about HTTP or any API-layer construct.
**Fix**: Keep the error as a plain subclass of `Error`:

```typescript
class JobNotFoundError extends Error { ... }
```

Map it to HTTP 404 inside `errorHandler` via an `instanceof JobNotFoundError` branch.

---

### Violation L4 — Application service accepts Express `Request`

**File**: `src/application/services/job-service.ts`
**Lines**:

```typescript
import { Request } from 'express';
...
const searchJobsFromRequest = async (req: Request): Promise<Job[]> => {
  const location = req.query.location as string | undefined;
  const minSalaryHeader = req.headers['x-min-salary'];
  ...
};
```

**Principle**: Framework leakage — the application layer must not know about Express. A `Request` in a use case couples the service to HTTP transport, makes it hard to reuse, and hides its real inputs.
**Fix**: Let the controller parse and type the inputs, then pass a plain DTO into the service:

```typescript
const searchJobs = async (filters: JobSearchFilters): Promise<Job[]> => { ... };
```

---

### Violation D1 — Service instantiates concrete `NotificationClient`

**File**: `src/application/services/job-application-service.ts`
**Lines**:

```typescript
import { NotificationClient } from '../../infrastructure/external/notification-client';
...
const legacyNotifier = new NotificationClient();
...
await legacyNotifier.send(params.applicantEmail, message);
```

**Principle**: Dependency Inversion — the service already receives a `NotificationPort`. Constructing a concrete infrastructure class inside the service re-couples the application layer to infrastructure and bypasses the port.
**Fix**: Remove the import and the `legacyNotifier`; use only the injected `notificationPort`. Wire the concrete client at the composition root (`src/app.ts`) as usual.

---

### Violation D2 — Direct `axios` call from application layer

**File**: `src/application/services/audit-service.ts`
**Lines**: `import axios from 'axios';` and `axios.post(AUDIT_URL, { event, payload, at })` inside `logJobEvent`. Invoked from `job-service.ts`.
**Principle**: Dependency Inversion / ports-and-adapters — the application layer should not import HTTP clients directly. It must depend on a port.
**Fix**: Introduce an `AuditPort` in `domain/ports`, implement an `AuditClient` adapter in `infrastructure/external`, and inject the port into `jobService`:

```typescript
interface AuditPort {
  logJobEvent(event: string, payload: Record<string, unknown>): Promise<void>;
}
```

---

### Violation D3 — Domain reads `process.env`

**File**: `src/domain/models/job.ts`
**Lines**:

```typescript
const maxSalaryEnv = process.env.MAX_SALARY;
if (maxSalaryEnv) { ... throw new Error(`Salary ${salary} exceeds configured maximum ${maxSalary}`); }
```

**Principle**: The domain layer must be pure — no framework, no I/O, no config lookups. Config belongs at the composition root; the domain receives the values (or a policy) as arguments.
**Fix**: Move the max-salary rule into the application layer or a domain `SalaryPolicy` value object, and pass the limit in from `app.ts`:

```typescript
const createJob = (input: CreateJobInput, policy: SalaryPolicy): Job => { ... };
```

---

### Violation X1 — `console.log` instead of a `Logger` port

**Files**: `src/application/services/job-service.ts`, `src/domain/models/job.ts`
**Lines**: `console.log('job created', { activity: 'jobCreated', ... })` and `console.log('job model constructed', { activity: 'jobModelCreated', ... })`.
**Principle**: Cross-cutting concerns (logging, tracing, metrics) must go through an abstraction, not the global `console`. Domain code in particular must not perform I/O.
**Fix**: Define `LoggerPort` in `domain/ports` with `info(activity, data)` / `error(...)`, implement `ConsoleLogger` in `infrastructure/logging`, and inject it everywhere it's used.

---

### Violation X2 — API-layer Zod schema imported into application layer

**File**: `src/application/services/job-service.ts`
**Lines**:

```typescript
import { createJobSchema } from '../../api/schemas/job-schemas';
...
const validated = createJobSchema.parse(params);
```

**Principle**: Dependency rule — application must not depend on the API layer. Import direction is `api → application → domain`, never the other way.
**Fix**: Validate at the controller boundary only. The service accepts an already-typed `CreateJobParams` DTO defined in the application (or domain) layer.

---

### Violation X3 — Business logic inside repository (and on the port)

**Files**:
- `src/domain/ports/job-repository.ts` — `findActiveHighPayingJobs(): Promise<Job[]>` on the port interface.
- `src/infrastructure/repositories/in-memory-job-repository.ts` — implementation with inline filter (`salary > 100000`) and sort.

**Principle**: Repositories should be persistence adapters, not containers for business rules. Business policies (“what is a high-paying job?”) belong in the service or a dedicated use case; including them on the port interface spreads the leak.
**Fix**: Remove the method from the port and from the infra class. Add a use case / service method that composes simple queries:

```typescript
const getFeaturedJobs = async (): Promise<Job[]> => {
  const all = await jobRepository.findAll();
  return all
    .filter((job) => job.salary > HIGH_SALARY_THRESHOLD)
    .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
};
```

The threshold should itself come from config injected at the composition root, not be hard-coded inside the repo.

---

### SNEAKY Violation — Domain model imports from infrastructure

**File**: `src/domain/models/job.ts`
**Line**: `import { generateId } from '../../infrastructure/utils/id-generator';`
**Principle**: Dependency rule — the domain layer must never depend on infrastructure.
**Why it's sneaky**: `generateId()` is a small utility and the code works fine. Most developers don't trace the import path and realize it crosses an architectural boundary.
**Fix**: Either accept the `id` as a parameter in `createJob()` (and let the application layer generate it), or define an `IdGenerator` port in the domain and inject the implementation.

---

## Scoring Cheat Sheet

- **Standard violations**: 20 (#1–10 plus L1–L4, D1–D3, X1–X3) × 2 pts (find + fix) = **40 pts**
- **Sneaky bonus**: +1 find + 1 fix = up to **2 bonus pts**
- **Theoretical max**: **42 pts**

### Pass-mark suggestions

| Rating       | Points        | Comment                                                   |
| ------------ | ------------- | --------------------------------------------------------- |
| "Architect"  | 34+ (≥ 80%)   | Found almost every violation and proposed correct fixes.  |
| "Senior"     | 27–33 (≥ 65%) | Found most layer + DIP violations.                        |
| "Mid"        | 20–26 (≥ 50%) | Found code-style + surface-level layering issues.         |
| "Junior"     | < 20          | Reread the README.                                        |
