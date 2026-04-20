# ANSWER KEY — Facilitator Eyes Only

> **Do not share this file with participants until after the exercise.**

> **Codebase layout update**: paths in this file have been aligned with the
> current ("hirer-aligned") `src/` tree. Key renames: `domain/models` →
> `entities`, `domain/ports` → `entities/gateways`, `domain/errors` →
> `entities/errors`, `api/controllers` → `application/<feature>/*Controller.ts`,
> `api/middleware` → `application/middleware`, `api/schemas` →
> `application/<feature>/*Schemas.ts`, `application/services/*-service.ts` →
> `usecases/<usecase>/*Interactor.ts`, `infrastructure/repositories` →
> `infrastructure/<feature>`, `infrastructure/external` →
> `infrastructure/notifications`, kebab-case → camelCase on all file names.
>
> **Error-type refactor (2026-04)**: the domain/application error types
> (`HttpError`, `JobNotFoundError`, `ApplicationFailedError`,
> `SalaryLimitExceededError`) are now **factory functions**
> (`createXxxError(...)`) returning `Error & { ...metadata }` rather than
> `class`es. The error handler discriminates via type-predicate functions
> (`isHttpError`, `isApplicationFailedError`, `isSalaryLimitExceededError`)
> instead of `instanceof`. Violation L3 (`JobNotFoundError` extending
> `HttpError`) was **removed as a side-effect of that refactor** — see
> [`VIOLATIONS.md`](VIOLATIONS.md).

---

## Violation Summary

| #   | Violation                                         | File                                                      | Category             | Difficulty |
| --- | ------------------------------------------------- | --------------------------------------------------------- | -------------------- | ---------- |
| 1   | `any` type on parameter                           | `src/usecases/searchJobs/searchJobsInteractor.ts`         | Code Style           | Easy       |
| 2   | `as` casting on `req.body`                        | `src/application/jobApplications/applyToJobController.ts` | Code Style           | Easy       |
| 3   | HTTP error thrown in usecase layer                | `src/usecases/{getJob,updateJob,deleteJob}/*Interactor.ts` | Clean Arch / Layer   | Medium     |
| 4   | Business logic in controller                      | `src/application/jobs/listJobsController.ts`              | SRP / Clean Arch     | Medium     |
| 5   | Concrete infrastructure type in usecase layer     | `src/usecases/applyToJob/applyToJobInteractor.ts`         | Clean Arch / DIP     | Medium     |
| 6   | `.then()` chain instead of async/await            | `src/infrastructure/notifications/notificationClient.ts`  | Code Style           | Easy       |
| 7   | Curried function                                  | `src/usecases/formatJob/formatJobForPlatform.ts`          | Code Style           | Easy       |
| 8   | Missing Zod validation on update endpoint         | `src/application/jobs/updateJobController.ts`             | Input Validation     | Medium     |
| 9   | Third-party type (`AxiosResponse`) in domain gateway | `src/entities/gateways/notificationGateway.ts`         | Clean Arch / Leak    | Hard       |
| 10  | `index.ts` barrel file                            | (not re-injected in current tree)                         | Code Style           | Easy       |
| L1  | Infrastructure imports API schema                 | `src/infrastructure/jobs/inMemoryJobRepository.ts`        | Clean Arch / Layer   | Medium     |
| L2  | Controller bypasses usecase, calls repo directly  | `src/application/jobs/{getJobsByCompany,getFeaturedJobs}Controller.ts` | Clean Arch / Layer | Medium |
| ~~L3~~ | ~~Domain error extends API `HttpError`~~      | ~~`src/entities/errors/jobNotFoundError.ts`~~             | ~~Clean Arch / Layer~~ | ~~Easy~~ |
| L4  | Usecase accepts Express `Request`                 | `src/usecases/searchJobs/searchJobsInteractor.ts`         | Clean Arch / Leak    | Hard       |
| D1  | Usecase instantiates concrete notification client | `src/usecases/applyToJob/applyToJobInteractor.ts`         | Clean Arch / DIP     | Medium     |
| D2  | Direct `axios` call from usecase layer            | `src/usecases/auditJobEvent/auditJobEventInteractor.ts`   | Clean Arch / DIP     | Hard       |
| D3  | Domain reads `process.env`                        | `src/entities/job.ts`                                     | Clean Arch / Config  | Hard       |
| X1  | `console.log` instead of a `Logger` gateway       | `src/usecases/createJob/createJobInteractor.ts`, `src/entities/job.ts` | Clean Arch / DIP | Easy |
| X2  | API-layer Zod schema imported into usecase        | `src/usecases/createJob/createJobInteractor.ts`           | Clean Arch / Layer   | Medium     |
| X3  | Business logic inside repository (and on gateway) | `src/infrastructure/jobs/inMemoryJobRepository.ts`, `src/entities/gateways/jobRepository.ts` | Clean Arch / SRP | Medium |
| O1  | Switch-on-platform in formatter                   | `src/usecases/formatJob/formatJobForPlatform.ts`          | SOLID / OCP          | Easy       |
| O2  | Growing predicate chain in error handler          | `src/application/middleware/errorHandlerMiddleware.ts`    | SOLID / OCP          | Medium     |
| Li1 | Throttled notification client breaks gateway contract | `src/infrastructure/notifications/throttledNotificationClient.ts` | SOLID / LSP | Hard   |
| Li2 | Read-only job repository throws on `save/update/remove` | `src/infrastructure/jobs/readOnlyJobRepository.ts`  | SOLID / LSP          | Medium     |
| I1  | Fat `JobRepository` gateway (persistence + reporting + notify) | `src/entities/gateways/jobRepository.ts`   | SOLID / ISP          | Medium     |
| I2  | Fat `JobApplicationRepository` gateway (CRUD + lifecycle + export) | `src/entities/gateways/jobApplicationRepository.ts` | SOLID / ISP | Medium |
| D4  | Missing `Clock` gateway; `new Date()` scattered   | `src/entities/job.ts`, `src/usecases/applyToJob/applyToJobInteractor.ts`, `src/usecases/auditJobEvent/auditJobEventInteractor.ts` | Clean Arch / DIP | Medium |
| D5  | Usecase reads `process.env.NOTIFICATION_ENABLED` / `NOTIFICATION_RETRIES` | `src/usecases/applyToJob/applyToJobInteractor.ts` | Clean Arch / Config | Medium |
| E1  | Domain throws generic `new Error` for salary breach | `src/entities/job.ts`                                   | Error Handling       | Easy       |
| E2  | Empty `catch` blocks swallow failures silently    | `src/usecases/applyToJob/applyToJobInteractor.ts`, `src/usecases/{createJob,updateJob,deleteJob}/*Interactor.ts` | Error Handling | Easy |
| A1  | Anemic `Job` entity (pure data, zero behaviour)   | `src/entities/job.ts`                                     | DDD / Anemic Model   | Medium     |
| A2  | Primitive obsession (`salary: number`, `applicantEmail: string`) | `src/entities/job.ts`, `src/entities/jobApplication.ts` | DDD / Primitive Obsession | Medium |
| S   | Domain model imports from infrastructure          | `src/entities/job.ts`                                     | Clean Arch / Layer   | **Sneaky** |

---

## Category distribution

| Category                                         | Count | Items                                      |
| ------------------------------------------------ | ----- | ------------------------------------------ |
| Clean Architecture — layering                    | 6     | #3, #9, L1, L2, X2, S                      |
| Clean Architecture — DIP                         | 6     | #5, D1, D2, X1, D4, D5                     |
| Clean Architecture — leak/config                 | 2     | L4, D3                                     |
| Clean Architecture — SRP                         | 2     | #4, X3                                     |
| SOLID — OCP                                      | 2     | O1, O2                                     |
| SOLID — LSP                                      | 2     | Li1, Li2                                   |
| SOLID — ISP                                      | 2     | I1, I2                                     |
| Error handling                                   | 2     | E1, E2                                     |
| DDD — anemic / primitive obsession               | 2     | A1, A2                                     |
| Code Style                                       | 5     | #1, #2, #6, #7, #10                        |
| Input Validation                                 | 1     | #8                                         |

**Clean-Architecture + SOLID + DDD total: 26 / 32 (~81%)** — code style is a clear minority.

*(L3 previously counted under layering; removed post-refactor.)*

---

## Detailed Breakdown

### Violation 1 — `any` type on parameter

**File**: `src/usecases/searchJobs/searchJobsInteractor.ts`
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

**File**: `src/application/jobApplications/applyToJobController.ts`
**Line**: `const body = req.body as CreateApplicationRequest;`
**Principle**: "Do not use casting, `as` should not be used"
**Fix**: Use the existing Zod schema to parse and validate:

```typescript
const body = createApplicationSchema.parse(req.body);
```

---

### Violation 3 — HTTP error thrown in usecase layer

**Files**:
- `src/usecases/getJob/getJobInteractor.ts`
- `src/usecases/updateJob/updateJobInteractor.ts`
- `src/usecases/deleteJob/deleteJobInteractor.ts`

**Smell**:

```typescript
import { createHttpError } from '../../application/middleware/errorHandlerMiddleware';
// ...
throw createHttpError(404, 'Job not found');
```

**Principle**: "Do not throw HTTP errors outside of the API Controller"
**Fix**: Throw a domain-specific error and let the error handler map it:

```typescript
import { createJobNotFoundError } from '../../entities/errors/jobNotFoundError';
throw createJobNotFoundError(id);
```

Then register an `isJobNotFoundError` branch in `errorHandler` (which already
knows how to read `err.statusCode`, so the mapping is trivial).

---

### Violation 4 — Business logic in controller

**File**: `src/application/jobs/listJobsController.ts`
**Lines**: The `listJobs` handler filters and sorts jobs inline:

```typescript
const filtered = allJobs
  .filter(...)
  .filter(...)
  .sort(...);
```

**Principle**: Single Responsibility / Clean Architecture — controllers should delegate to usecases.
**Fix**: Move filtering and sorting into a dedicated `listJobsInteractor` /
`searchJobsInteractor` (the latter already exists and encodes the same logic).
The controller then only parses input and formats the response.

---

### Violation 5 — Concrete infrastructure type in usecase layer

**File**: `src/usecases/applyToJob/applyToJobInteractor.ts`
**Lines**:

```typescript
import { InMemoryJobRepository } from '../../infrastructure/jobs/inMemoryJobRepository';
// ...
jobRepository: InMemoryJobRepository,
```

**Principle**: Dependency Inversion — the usecase layer should depend on the abstract `JobRepository` gateway.
**Fix**: Change the parameter type to the gateway interface:

```typescript
import { JobRepository } from '../../entities/gateways/jobRepository';
// ...
jobRepository: JobRepository,
```

Propagate the change in `applyToJobController.ts` and `router.ts` which carry the concrete type too.

---

### Violation 6 — `.then()` chain instead of async/await

**File**: `src/infrastructure/notifications/notificationClient.ts`
**Fix**:

```typescript
async send(email: string, message: string): Promise<AxiosResponse> {
  try {
    const response = await axios.post(`${NOTIFICATION_API_URL}/api/notify`, { email, message });
    console.log('Notification sent successfully', { status: response.status });
    return response;
  } catch (error) {
    console.error('Failed to send notification', { error: (error as Error).message });
    throw error;
  }
}
```

---

### Violation 7 — Curried function

**File**: `src/usecases/formatJob/formatJobForPlatform.ts`
**Line**: `const formatJobForPlatform = (job: Job) => (platform: string): FormattedJob =>`
**Principle**: "Do not curry functions"
**Fix**:

```typescript
const formatJobForPlatform = (platform: string, job: Job): FormattedJob => { ... }
```

---

### Violation 8 — Missing Zod validation on update endpoint

**File**: `src/application/jobs/updateJobController.ts`
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

### Violation 9 — Third-party type in domain gateway

**File**: `src/entities/gateways/notificationGateway.ts`
**Principle**: "Don't use third-party library types directly in domain logic".
**Fix**: Replace `AxiosResponse` with an internal domain result type.

---

### Violation 10 — `index.ts` barrel file

*Not re-injected in the current tree.* The original answer key flagged
`src/domain/models/index.ts`; the new `src/entities/*` layout does not use a
barrel file. Retained here for historical completeness.

---

### Violation L1 — Infrastructure imports from API layer

**File**: `src/infrastructure/jobs/inMemoryJobRepository.ts`
**Line**: `import { CreateJobRequest } from '../../application/jobs/jobSchemas';` and the `saveFromRequest(id, request)` method.
**Principle**: Dependency rule — infrastructure is an outer layer, application/API is also outer; one outer layer must not depend on another. Repositories should speak only `entity` types.
**Fix**: Drop the API-layer import; accept a fully-formed `Job` (or a domain-defined input DTO):

```typescript
async saveFromRequest(id: string, input: JobInput): Promise<Job> { ... }
```

Or simply remove the convenience method and let the usecase build the `Job` and call `save()`.

---

### Violation L2 — Controller bypasses usecase, calls repository directly

**Files**:
- `src/application/jobs/getJobsByCompanyController.ts` — `deps.jobRepository.findAll()`
- `src/application/jobs/getFeaturedJobsController.ts` — `deps.jobRepository.findActiveHighPayingJobs()`

**Principle**: Clean Architecture — controllers are thin adapters that delegate to usecases; they must not reach into infrastructure gateways.
**Fix**: Route both through their existing interactors (`getJobsByCompanyInteractor`, `getFeaturedJobsInteractor`). The controller then only parses input and formats the response.

---

### Violation L3 — Domain error extends API `HttpError` *(RESOLVED)*

**Status**: Removed by the error-type factory refactor.
**Original file**: `src/entities/errors/jobNotFoundError.ts`
**Original smell**: `class JobNotFoundError extends HttpError` with `import { HttpError } from '../../application/middleware/errorHandlerMiddleware';` — the innermost (domain) layer depended on an application-layer class.
**Current state**: `JobNotFoundError` is now a plain factory:

```typescript
type JobNotFoundError = Error & { statusCode: number; jobId: string };
const createJobNotFoundError = (jobId: string): JobNotFoundError => { ... };
```

No application-layer import remains; the violation no longer exists.

---

### Violation L4 — Usecase accepts Express `Request`

**File**: `src/usecases/searchJobs/searchJobsInteractor.ts`
**Lines**:

```typescript
import { Request } from 'express';
// ...
const searchJobsFromRequest = async (req: Request): Promise<Job[]> => {
  const location = req.query.location as string | undefined;
  const minSalaryHeader = req.headers['x-min-salary'];
  // ...
};
```

**Principle**: Framework leakage — the usecase layer must not know about Express. A `Request` in a usecase couples it to HTTP transport, makes it hard to reuse, and hides its real inputs.
**Fix**: Let the controller parse and type the inputs, then pass a plain DTO into the usecase:

```typescript
const searchJobs = async (filters: JobSearchFilters): Promise<Job[]> => { ... };
```

---

### Violation D1 — Usecase instantiates concrete notification client

**File**: `src/usecases/applyToJob/applyToJobInteractor.ts`
**Lines**:

```typescript
import { createNotificationClient } from '../../infrastructure/notifications/notificationClient';
// ...
const legacyNotifier = createNotificationClient();
// ...
await legacyNotifier.send(params.applicantEmail, message);
```

**Principle**: Dependency Inversion — the usecase already receives a `NotificationGateway`. Constructing a concrete infrastructure adapter inside the usecase re-couples the application layer to infrastructure and bypasses the gateway.
**Fix**: Remove the import and the `legacyNotifier`; use only the injected `notificationGateway`. Wire the concrete client at the composition root (`src/app.ts`) as usual.

---

### Violation D2 — Direct `axios` call from usecase layer

**File**: `src/usecases/auditJobEvent/auditJobEventInteractor.ts`
**Lines**: `import axios from 'axios';` and `axios.post(AUDIT_URL, { event, payload, at })` inside `auditJobEvent`. Invoked from `createJobInteractor`, `updateJobInteractor`, and `deleteJobInteractor`.
**Principle**: Dependency Inversion / ports-and-adapters — the usecase layer should not import HTTP clients directly. It must depend on a gateway.
**Fix**: Introduce an `AuditGateway` in `src/entities/gateways`, implement an `auditClient` adapter in `src/infrastructure/auditClient`, and inject the gateway into the usecases:

```typescript
interface AuditGateway {
  logJobEvent(event: string, payload: Record<string, unknown>): Promise<void>;
}
```

*(Note: `src/infrastructure/auditClient/auditClient.ts` already exists — it just
isn't wired through a gateway interface yet.)*

---

### Violation D3 — Domain reads `process.env`

**File**: `src/entities/job.ts`
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

### Violation X1 — `console.log` instead of a `Logger` gateway

**Files**: `src/usecases/createJob/createJobInteractor.ts`, `src/entities/job.ts`
**Lines**: `console.log('job created', { activity: 'jobCreated', ... })` and `console.log('job model constructed', { activity: 'jobModelCreated', ... })`.
**Principle**: Cross-cutting concerns (logging, tracing, metrics) must go through an abstraction, not the global `console`. Domain code in particular must not perform I/O.
**Fix**: Define `LoggerGateway` in `src/entities/gateways` with `info(activity, data)` / `error(...)`, implement `ConsoleLogger` in `src/infrastructure/logging`, and inject it everywhere it's used.

---

### Violation X2 — API-layer Zod schema imported into usecase layer

**File**: `src/usecases/createJob/createJobInteractor.ts`
**Lines**:

```typescript
import { createJobSchema } from '../../application/jobs/jobSchemas';
// ...
const validated = createJobSchema.parse(params);
```

**Principle**: Dependency rule — usecases must not depend on the API/application layer. Import direction is `application → usecases → entities`, never the other way.
**Fix**: Validate at the controller boundary only. The usecase accepts an already-typed `CreateJobParams` DTO defined in the usecase (or entity) layer.

---

### Violation X3 — Business logic inside repository (and on the gateway)

**Files**:
- `src/entities/gateways/jobRepository.ts` — `findActiveHighPayingJobs(): Promise<Job[]>` on the gateway interface.
- `src/infrastructure/jobs/inMemoryJobRepository.ts` — implementation with inline filter (`salary > 100000`) and sort.

**Principle**: Repositories should be persistence adapters, not containers for business rules. Business policies ("what is a high-paying job?") belong in the usecase; including them on the gateway interface spreads the leak.
**Fix**: Remove the method from the gateway and from the infra class. Add a usecase that composes simple queries:

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

### Violation O1 — Switch-on-platform in formatter (OCP)

**File**: `src/usecases/formatJob/formatJobForPlatform.ts`
**Smell**:

```typescript
if (platform === 'seek') { ... }
else if (platform === 'linkedin') { ... }
else if (platform === 'glassdoor') { ... }
else if (platform === 'monster') { ... }
else { /* default */ }
```

**Principle**: Open/Closed. Adding a new platform forces modifying this function.
**Fix**: Platform-keyed strategy map:

```typescript
type PlatformFormatter = (job: Job) => string;
const salaryFormatters: Record<string, PlatformFormatter> = {
  seek: (j) => `$${j.salary.toLocaleString()} per year`,
  linkedin: (j) => `AUD ${j.salary.toLocaleString()}`,
};
const formatSalary = (job: Job, platform: string): string =>
  (salaryFormatters[platform] ?? defaultFormatter)(job);
```

---

### Violation O2 — Growing predicate chain in error handler (OCP)

**File**: `src/application/middleware/errorHandlerMiddleware.ts`
**Smell**: `if (isHttpError(err)) ... else if (isApplicationFailedError(err)) ... else if (isSalaryLimitExceededError(err)) ... else if (err.name === 'ZodError') ... else if (err.name === 'ValidationError') ...` — every new error type forces modifying this function.

*(Prior to the factory refactor this was an `instanceof`-chain; the structure is identical, only the discrimination mechanism changed.)*

**Fix**: Registry-based dispatch keyed on a discriminant. Because errors are now
plain `Error & { name; ...metadata }` objects, the `.name` property is a clean
discriminator:

```typescript
type Handler = (e: Error, res: Response) => void;
const handlers: Record<string, Handler> = {
  HttpError: (e, r) => r.status((e as HttpError).statusCode).json({ error: e.message }),
  ApplicationFailedError: (e, r) => r.status(400).json({ error: e.message }),
  SalaryLimitExceededError: (e, r) => { /* ... */ },
  ZodError: (e, r) => r.status(400).json({ error: 'Validation failed', details: e }),
};
const handler = handlers[err.name] ?? defaultHandler;
handler(err, res);
```

New error types register themselves in the map without touching core logic.

---

### Violation Li1 — `createThrottledNotificationClient` breaks gateway contract (LSP)

**File**: `src/infrastructure/notifications/throttledNotificationClient.ts`
**Smell**: The factory composes an inner `NotificationGateway` but, once the throttle counter trips, returns a fake `AxiosResponse` (`status: 429`) **without calling the inner client** — violating the gateway contract ("sent, or error"). Consumers that hold a `NotificationGateway` cannot rely on a successful return meaning "delivered".
**Principle**: Subtypes (and decorators) must be substitutable for the gateway they implement.
**Fix**: Honour the contract by throwing a domain-specific error when throttled:

```typescript
const createThrottlingNotifier = (inner: NotificationGateway): NotificationGateway => {
  return {
    send: async (email, msg) => {
      if (isThrottled()) throw createThrottledError();
      return inner.send(email, msg);
    },
  };
};
```

---

### Violation Li2 — `createReadOnlyJobRepository` throws on writes (LSP)

**File**: `src/infrastructure/jobs/readOnlyJobRepository.ts`
**Smell**: Spreads an inner `InMemoryJobRepository` and overrides `save`, `update`, `remove`, `saveFromRequest` to `throw new Error('Read-only mode: ...')`. The returned object structurally satisfies `JobRepository`, so any caller holding that gateway reference cannot substitute this factory's output safely.
**Fix**: Don't model read-only-ness as a repo that pretends to satisfy the full gateway. Introduce a narrower `JobReadRepository` gateway and make `JobRepository` *extend* it for full access. Callers that only need reads depend on the narrower type.

---

### Violation I1 — Fat `JobRepository` gateway (ISP)

**File**: `src/entities/gateways/jobRepository.ts`
**Smell**: Gateway now mixes persistence (`findAll`, `save`, `update`, `remove`), business queries (`findActiveHighPayingJobs`), reporting (`getTotalJobsPosted`, `getAverageSalary`), and notifications (`sendWeeklyReport`). Every implementor must stub methods they don't need.
**Fix**: Split by responsibility:

```typescript
interface JobReadGateway { findAll(): Promise<Job[]>; findById(id: string): Promise<Job | undefined>; }
interface JobWriteGateway { save(j: Job): Promise<Job>; update(...): ...; remove(id: string): Promise<boolean>; }
interface JobReportingGateway { getTotalJobsPosted(): Promise<number>; getAverageSalary(): Promise<number>; }
interface WeeklyReportGateway { sendWeeklyReport(email: string): Promise<void>; }
```

---

### Violation I2 — Fat `JobApplicationRepository` gateway (ISP)

**File**: `src/entities/gateways/jobApplicationRepository.ts`
**Smell**: CRUD (`findByJobId`, `save`) is mixed with lifecycle (`archiveOldApplications`, `sendFollowUp`), export (`exportToCsv`), and analytics (`getApplicantMetrics`).
**Fix**: Segregate into `ApplicationReadGateway`, `ApplicationWriteGateway`, `ApplicationLifecycleGateway`, `ApplicationExportGateway`, `ApplicationMetricsGateway` — consumers depend on the smallest gateway they need.

---

### Violation D4 — Missing `Clock` gateway

**Files**:
- `src/entities/job.ts` — `postedAt: new Date()`
- `src/usecases/applyToJob/applyToJobInteractor.ts` — `appliedAt: new Date()`
- `src/usecases/auditJobEvent/auditJobEventInteractor.ts` — `at: new Date().toISOString()`

**Smell**: Time is a hidden dependency. Code is non-deterministic; tests can't freeze time without resorting to `jest.useFakeTimers()` globally.
**Fix**: Define a domain gateway and inject it at the composition root:

```typescript
interface ClockGateway { now(): Date; }
const systemClock: ClockGateway = { now: () => new Date() };
// tests: const fixedClock: ClockGateway = { now: () => new Date('2026-01-01') };
```

---

### Violation D5 — Usecase reads `process.env` directly

**File**: `src/usecases/applyToJob/applyToJobInteractor.ts`
**Line**: `const notificationsEnabled = process.env.NOTIFICATION_ENABLED !== 'false';` and `Number(process.env.NOTIFICATION_RETRIES ?? '1')`.
**Principle**: Usecases shouldn't know they're running under Node / in an env-variable world. Configuration is an infrastructure concern.
**Fix**: Read env once at the composition root; inject a typed `NotificationPolicy` (or feature-flag gateway):

```typescript
interface NotificationPolicy { isEnabled(): boolean; retries(): number; }
```

---

### Violation E1 — Generic `Error` thrown from domain

**File**: `src/entities/job.ts`
**Line**: `throw new Error(`Salary ${salary} exceeds configured maximum ${maxSalary}`);`
**Smell**: `createJob()` throws a generic `Error` when salary exceeds env-configured max. Generic `Error` carries no domain meaning; controllers can't distinguish it from unrelated failures and must fall through to the 500 branch. Note that a factory for this exact case (`createSalaryLimitExceededError`) already exists in `src/entities/errors/salaryLimitExceededError.ts` — it just isn't used here.
**Fix**: Use the existing factory:

```typescript
import { createSalaryLimitExceededError } from './errors/salaryLimitExceededError';
// ...
throw createSalaryLimitExceededError(salary, maxSalary);
```

The error handler already has an `isSalaryLimitExceededError` branch that maps
it to HTTP 422 with `{ salary, max }` in the body (this re-exposes O2's
extension point).

---

### Violation E2 — Empty `catch` blocks silently swallow errors

**Files**:
- `src/usecases/applyToJob/applyToJobInteractor.ts` — `try { await legacyNotifier.send(...) } catch (_err) { /* ignored */ }` and `catch (_err) { attempt += 1; }` on the retry loop.
- `src/usecases/{createJob,updateJob,deleteJob}/*Interactor.ts` — `auditJobEvent(...).catch(() => {})` on audit calls.

**Principle**: Errors carry information. Swallowing them hides bugs, data loss, and security incidents from operators.
**Fix**: Log with context and decide (retry, surface, or escalate):

```typescript
} catch (error) {
  logger.error('legacy notifier failed', {
    activity: 'sendApplicationNotification',
    applicationId: saved.id,
    error: (error as Error).message,
  });
  // decide: continue (non-critical) vs. rethrow (critical)
}
```

---

### Violation A1 — Anemic `Job` entity

**File**: `src/entities/job.ts`
**Smell**: `Job` is a pure data bag. All behaviour — "is this a high-paying job?", "does this job match these filters?", "how do we update salary with audit?" — lives in usecases, controllers, and repositories. The domain model is bypassed.
**Principle**: Rich domain models encapsulate behaviour alongside state; an anemic model is just a struct with extra steps.
**Fix**: Add functions that operate on `Job` and expose them alongside the type (or return them from `createJob`):

```typescript
interface Job {
  readonly id: string;
  // ...
}
const matches = (job: Job, filters: JobSearchFilters): boolean => { ... };
const isHighPaying = (job: Job, threshold: number): boolean => job.salary > threshold;
const withUpdatedSalary = (job: Job, newSalary: number): Job => ({ ...job, salary: newSalary });
```

*(Functional style preferred over classes per project convention — same
encapsulation, no `class` keyword.)*

---

### Violation A2 — Primitive obsession on `salary` and `applicantEmail`

**Files**: `src/entities/job.ts`, `src/entities/jobApplication.ts`
**Smell**: `salary: number` (no currency, no precision, silently accepts negatives); `applicantEmail: string` (no validation on construction — only at the Zod boundary, and duplicated ad-hoc elsewhere).
**Fix**: Introduce value-object factories with validation that make invalid states unrepresentable:

```typescript
type Money = { readonly amount: number; readonly currency: 'AUD' | 'USD' };
const createMoney = (amount: number, currency: 'AUD' | 'USD'): Money => {
  if (amount < 0) throw createInvalidMoneyError(amount);
  return { amount, currency };
};

type Email = { readonly value: string };
const createEmail = (raw: string): Email => {
  if (!/^[^@\s]+@[^@\s]+$/.test(raw)) throw createInvalidEmailError(raw);
  return { value: raw.toLowerCase() };
};
```

Value objects kill duplicate validation, document intent, and move invariants into the type system.

---

### SNEAKY Violation — Domain model imports from infrastructure

**File**: `src/entities/job.ts`
**Line**: `import { generateId } from '../infrastructure/utils/idGenerator';`
**Principle**: Dependency rule — the domain layer must never depend on infrastructure.
**Why it's sneaky**: `generateId()` is a small utility and the code works fine. Most developers don't trace the import path and realize it crosses an architectural boundary.
**Fix**: Either accept the `id` as a parameter in `createJob()` (and let the usecase layer generate it), or define an `IdGenerator` gateway in `src/entities/gateways` and inject the implementation.

---

## Scoring Cheat Sheet

- **Standard violations**: 31 (#1–10 minus retired #10 barrel, L1/L2/L4, D1–D5, X1–X3, O1, O2, Li1, Li2, I1, I2, E1, E2, A1, A2) × 2 pts (find + fix) = **62 pts**
- **Sneaky bonus**: +1 find + 1 fix = up to **2 bonus pts**

*(L3 is excluded from scoring — it was neutralised by the error-type factory
refactor. Violation #10 is also excluded because the current tree has no
barrel file to find.)*

- **Theoretical max: 62 + 2 = 64 pts** (31 × 2 standard + 2 bonus for sneaky).

### Pass-mark suggestions

| Rating       | Points        | Comment                                                         |
| ------------ | ------------- | --------------------------------------------------------------- |
| "Architect"  | 52+ (≥ 80%)   | Found almost every violation and proposed correct fixes.        |
| "Senior"     | 42–51 (≥ 65%) | Found most layering, DIP, and SOLID violations.                 |
| "Mid"        | 32–41 (≥ 50%) | Found code-style + surface-level architecture issues.           |
| "Junior"     | < 32          | Reread the README and run through `docs/clean-architecture.md`. |
