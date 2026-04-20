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
| O1  | Switch-on-platform in formatter                   | `src/application/formatters/job-formatter.ts`             | SOLID / OCP          | Easy       |
| O2  | Growing `instanceof` chain in error handler       | `src/api/middleware/error-handler.ts`                     | SOLID / OCP          | Medium     |
| Li1 | `ThrottledNotificationClient` breaks base contract| `src/infrastructure/external/throttled-notification-client.ts` | SOLID / LSP     | Hard       |
| Li2 | `ReadOnlyJobRepository` throws on `save/update/remove`| `src/infrastructure/repositories/read-only-job-repository.ts` | SOLID / LSP | Medium  |
| I1  | Fat `JobRepository` port (persistence + reporting + notify) | `src/domain/ports/job-repository.ts`            | SOLID / ISP          | Medium     |
| I2  | Fat `JobApplicationRepository` port (CRUD + lifecycle + export) | `src/domain/ports/job-application-repository.ts` | SOLID / ISP  | Medium     |
| D4  | Missing `Clock` port; `new Date()` scattered      | `src/domain/models/job.ts`, `src/application/services/job-application-service.ts`, `src/application/services/audit-service.ts` | Clean Arch / DIP | Medium |
| D5  | Service reads `process.env.NOTIFICATION_ENABLED` / `NOTIFICATION_RETRIES` | `src/application/services/job-application-service.ts` | Clean Arch / Config | Medium |
| E1  | Domain previously threw generic `Error`; now wired through `errorHandler` too | `src/domain/models/job.ts`, `src/domain/errors/salary-limit-exceeded.ts` | Error Handling | Easy |
| E2  | Empty `catch` blocks swallow failures silently    | `src/application/services/job-application-service.ts`, `src/application/services/job-service.ts` | Error Handling | Easy |
| A1  | Anemic `Job` entity (pure data, zero behaviour)   | `src/domain/models/job.ts`                                | DDD / Anemic Model   | Medium     |
| A2  | Primitive obsession (`salary: number`, `applicantEmail: string`) | `src/domain/models/job.ts`, `src/domain/models/job-application.ts` | DDD / Primitive Obsession | Medium |
| S   | Domain model imports from infrastructure          | `src/domain/models/job.ts`                                | Clean Arch / Layer   | **Sneaky** |

---

## Category distribution

| Category                                         | Count | Items                                      |
| ------------------------------------------------ | ----- | ------------------------------------------ |
| Clean Architecture — layering                    | 7     | #3, #9, L1, L2, L3, X2, S                  |
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

**Clean-Architecture + SOLID + DDD total: 27 / 33 (~82%)** — code style is now a clear minority.

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

### Violation O1 — Switch-on-platform in formatter (OCP)

**File**: `src/application/formatters/job-formatter.ts`
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

### Violation O2 — Growing `instanceof` chain in error handler (OCP)

**File**: `src/api/middleware/error-handler.ts`
**Smell**: `if (err instanceof HttpError) ... else if (err instanceof ApplicationFailedError) ... else if (err instanceof SalaryLimitExceededError) ... else if (err.name === 'ZodError') ... else if (err.name === 'ValidationError') ...` — every new error class forces modifying this function.
**Fix**: Polymorphism on a `DomainError` base with `toHttpResponse()`, or a registry:

```typescript
type Handler = (e: Error, res: Response) => void;
const handlers = new Map<Function, Handler>();
handlers.set(HttpError, (e, r) => r.status((e as HttpError).statusCode).json(...));
// ...register new errors without touching core logic
```

---

### Violation Li1 — `ThrottledNotificationClient` breaks base contract (LSP)

**File**: `src/infrastructure/external/throttled-notification-client.ts`
**Smell**: Subclass `extends NotificationClient` and overrides `send` to silently return a fake `AxiosResponse` (`status: 429`) **without calling axios** once a throttle counter trips — violating the base contract ("sent, or error").
**Principle**: Subtypes must be substitutable for their base type.
**Fix**: Use composition (decorator) instead of inheritance, or have the subclass honour the contract by throwing `ThrottledError`:

```typescript
class ThrottlingNotifier implements NotificationPort {
  constructor(private readonly inner: NotificationPort) {}
  async send(email: string, msg: string) {
    if (this.isThrottled()) throw new ThrottledError();
    return this.inner.send(email, msg);
  }
}
```

---

### Violation Li2 — `ReadOnlyJobRepository` throws on writes (LSP)

**File**: `src/infrastructure/repositories/read-only-job-repository.ts`
**Smell**: `extends InMemoryJobRepository` but overrides `save`, `update`, `remove`, `saveFromRequest` to `throw new Error('Read-only mode: ...')`. Any caller holding a `JobRepository` reference cannot substitute this subtype safely.
**Fix**: Don't model read-only-ness via a broken subclass. Introduce a narrower `JobReadRepository` port and make `JobRepository` *extend* it for full access. Callers that only need reads depend on the narrower type.

---

### Violation I1 — Fat `JobRepository` port (ISP)

**File**: `src/domain/ports/job-repository.ts`
**Smell**: Port now mixes persistence (`findAll`, `save`, `update`, `remove`), business queries (`findActiveHighPayingJobs`), reporting (`getTotalJobsPosted`, `getAverageSalary`), and notifications (`sendWeeklyReport`). Every implementor must stub methods they don't need.
**Fix**: Split by responsibility:

```typescript
interface JobReadPort { findAll(): Promise<Job[]>; findById(id: string): Promise<Job | undefined>; }
interface JobWritePort { save(j: Job): Promise<Job>; update(...): ...; remove(id: string): Promise<boolean>; }
interface JobReportingPort { getTotalJobsPosted(): Promise<number>; getAverageSalary(): Promise<number>; }
interface WeeklyReportPort { sendWeeklyReport(email: string): Promise<void>; }
```

---

### Violation I2 — Fat `JobApplicationRepository` port (ISP)

**File**: `src/domain/ports/job-application-repository.ts`
**Smell**: CRUD (`findByJobId`, `save`) is mixed with lifecycle (`archiveOldApplications`, `sendFollowUp`), export (`exportToCsv`), and analytics (`getApplicantMetrics`).
**Fix**: Segregate into `ApplicationReadPort`, `ApplicationWritePort`, `ApplicationLifecyclePort`, `ApplicationExportPort`, `ApplicationMetricsPort` — consumers depend on the smallest port they need.

---

### Violation D4 — Missing `Clock` port

**Files**:
- `src/domain/models/job.ts` — `postedAt: new Date()`
- `src/application/services/job-application-service.ts` — `appliedAt: new Date()`
- `src/application/services/audit-service.ts` — `at: new Date().toISOString()`

**Smell**: Time is a hidden dependency. Code is non-deterministic; tests can't freeze time without resorting to `jest.useFakeTimers()` globally.
**Fix**: Define a domain port and inject it at the composition root:

```typescript
interface ClockPort { now(): Date; }
const systemClock: ClockPort = { now: () => new Date() };
// tests: const fixedClock: ClockPort = { now: () => new Date('2026-01-01') };
```

---

### Violation D5 — Service reads `process.env` directly

**File**: `src/application/services/job-application-service.ts`
**Line**: `const notificationsEnabled = process.env.NOTIFICATION_ENABLED !== 'false';` and `Number(process.env.NOTIFICATION_RETRIES ?? '1')`.
**Principle**: Application services shouldn't know they're running under Node / in an env-variable world. Configuration is an infrastructure concern.
**Fix**: Read env once at the composition root; inject a typed `NotificationPolicy` (or feature-flag port):

```typescript
interface NotificationPolicy { isEnabled(): boolean; retries(): number; }
```

---

### Violation E1 — Generic `Error` thrown from domain

**Files**: `src/domain/models/job.ts`, `src/domain/errors/salary-limit-exceeded.ts`
**Smell**: Prior to this exercise, `createJob()` did `throw new Error(...)` when salary exceeded env-configured max. Generic `Error` carries no domain meaning; controllers can't distinguish it from unrelated failures and must fall through to the 500 branch.
**Fix**: Introduce a domain-specific error with fields:

```typescript
class SalaryLimitExceededError extends Error {
  constructor(public readonly salary: number, public readonly max: number) {
    super(`Salary ${salary} exceeds configured maximum ${max}`);
    this.name = 'SalaryLimitExceededError';
  }
}
```

Map it to an HTTP response only at the API boundary (which re-exposes O2).

---

### Violation E2 — Empty `catch` blocks silently swallow errors

**Files**:
- `src/application/services/job-application-service.ts` — `try { await legacyNotifier.send(...) } catch (_err) {}` and `catch (_err) { attempt += 1; }` on retry loop.
- `src/application/services/job-service.ts` — `logJobEvent(...).catch(() => {})` on audit calls.

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

**File**: `src/domain/models/job.ts`
**Smell**: `Job` is a pure data bag. All behaviour — "is this a high-paying job?", "does this job match these filters?", "how do we update salary with audit?" — lives in services, controllers, and repositories. The domain model is bypassed.
**Principle**: Rich domain models encapsulate behaviour alongside state; an anemic model is just a struct with extra steps.
**Fix**: Add methods on `Job` (or return an object with methods from `createJob`):

```typescript
interface Job {
  readonly id: string;
  // ...
  matches(filters: JobSearchFilters): boolean;
  isHighPaying(threshold: number): boolean;
  withUpdatedSalary(newSalary: number): Job; // immutable update
}
```

---

### Violation A2 — Primitive obsession on `salary` and `applicantEmail`

**Files**: `src/domain/models/job.ts`, `src/domain/models/job-application.ts`
**Smell**: `salary: number` (no currency, no precision, silently accepts negatives); `applicantEmail: string` (no validation on construction — only at the Zod boundary, and duplicated ad-hoc elsewhere).
**Fix**: Introduce value objects with constructors that validate and make invalid states unrepresentable:

```typescript
class Money {
  private constructor(readonly amount: number, readonly currency: 'AUD' | 'USD') {}
  static of(amount: number, currency: 'AUD' | 'USD'): Money {
    if (amount < 0) throw new InvalidMoneyError(amount);
    return new Money(amount, currency);
  }
}
class Email {
  private constructor(readonly value: string) {}
  static of(raw: string): Email {
    if (!/^[^@\s]+@[^@\s]+$/.test(raw)) throw new InvalidEmailError(raw);
    return new Email(raw.toLowerCase());
  }
}
```

Value objects kill duplicate validation, document intent, and move invariants into the type system.

---

### SNEAKY Violation — Domain model imports from infrastructure

**File**: `src/domain/models/job.ts`
**Line**: `import { generateId } from '../../infrastructure/utils/id-generator';`
**Principle**: Dependency rule — the domain layer must never depend on infrastructure.
**Why it's sneaky**: `generateId()` is a small utility and the code works fine. Most developers don't trace the import path and realize it crosses an architectural boundary.
**Fix**: Either accept the `id` as a parameter in `createJob()` (and let the application layer generate it), or define an `IdGenerator` port in the domain and inject the implementation.

---

## Scoring Cheat Sheet

- **Standard violations**: 32 (#1–10, L1–L4, D1–D5, X1–X3, O1, O2, Li1, Li2, I1, I2, E1, E2, A1, A2) × 2 pts (find + fix) = **64 pts**
- **Sneaky bonus**: +1 find + 1 fix = up to **2 bonus pts**

Wait — total standard = 32 (the `S` row is the sneaky bonus, not standard). Count rows in the summary table = **33 total**, of which 32 are standard + 1 sneaky.

- **Theoretical max: 64 + 2 + 2 = 68 pts** (32 × 2 standard + 2 bonus for sneaky).

### Pass-mark suggestions

| Rating       | Points        | Comment                                                         |
| ------------ | ------------- | --------------------------------------------------------------- |
| "Architect"  | 55+ (≥ 80%)   | Found almost every violation and proposed correct fixes.        |
| "Senior"     | 44–54 (≥ 65%) | Found most layering, DIP, and SOLID violations.                 |
| "Mid"        | 34–43 (≥ 50%) | Found code-style + surface-level architecture issues.           |
| "Junior"     | < 34          | Reread the README and run through `docs/clean-architecture.md`. |
