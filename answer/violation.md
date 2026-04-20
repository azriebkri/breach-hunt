# Re-injected Violations Map

This document lists every Clean-Architecture, SOLID, DDD and Error-Handling
violation that has been re-injected into the restructured (hirer-aligned)
[`src/`](src/) tree. Each row gives the exact **file + line number** where the
violation appears, plus the identifier from [`ANSWER_KEY.md`](ANSWER_KEY.md).

Pure code-style violations (#1 `any`, #2 `as` cast, #6 `.then`, #7 curry, #8
missing Zod on update, #10 `index.ts` barrel) were deliberately **excluded**
per scope decision, so they are not listed here.

> **Note on recent refactors**: the domain/application error types have been
> converted from `class` definitions to factory functions (`createHttpError`,
> `createApplicationFailedError`, `createSalaryLimitExceededError`,
> `createJobNotFoundError`) with type-predicate discriminators. The underlying
> architectural violations are otherwise unchanged; only the call-site syntax
> (`throw createXxx(...)` instead of `throw new XxxError(...)`) and the error-
> handler discrimination (`isXxxError(err)` instead of `err instanceof XxxError`)
> are different. The `L3` row below has been **removed** because the new
> `JobNotFoundError` factory no longer imports from the application layer.

## Clean Architecture — Layering

| ID  | Principle       | File                                                 | Line(s)     | Detail                                                                                                                              |
| --- | --------------- | ---------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| #3  | Dependency Rule | `src/usecases/getJob/getJobInteractor.ts`            | 3, 10       | `import { createHttpError } from '../../application/middleware/errorHandlerMiddleware'`; usecase `throw createHttpError(404, ...)`. |
| #3  | Dependency Rule | `src/usecases/updateJob/updateJobInteractor.ts`      | 3, 14       | Same pattern — HTTP error thrown from usecase.                                                                                      |
| #3  | Dependency Rule | `src/usecases/deleteJob/deleteJobInteractor.ts`      | 2, 10       | Same pattern — HTTP error thrown from usecase.                                                                                      |
| #9  | Dependency Rule | `src/entities/gateways/notificationGateway.ts`       | 1, 4        | `import { AxiosResponse } from 'axios'` in domain gateway; gateway returns `Promise<AxiosResponse>`.                                |
| L1  | Dependency Rule | `src/infrastructure/jobs/inMemoryJobRepository.ts`   | 4, 8, 23–38 | Infra imports API-layer schema `CreateJobRequest`; `saveFromRequest()` consumes it.                                                 |
| L2  | Dependency Rule | `src/application/jobs/getJobsByCompanyController.ts` | 12          | Controller calls `deps.jobRepository.findAll()` directly instead of a use case.                                                     |
| L2  | Dependency Rule | `src/application/jobs/getFeaturedJobsController.ts`  | 11          | Controller calls `deps.jobRepository.findActiveHighPayingJobs()` directly.                                                          |
| X2  | Dependency Rule | `src/usecases/createJob/createJobInteractor.ts`      | 3, 16       | Usecase imports Zod schema from API layer and calls `createJobSchema.parse(...)`.                                                   |
| S   | Dependency Rule | `src/entities/job.ts`                                | 1           | Domain imports `generateId` from `infrastructure/utils/idGenerator`.                                                                |

## Clean Architecture — Dependency Inversion (DIP)

| ID  | Principle | File                                                    | Line(s) | Detail                                                                                                   |
| --- | --------- | ------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| #5  | DIP       | `src/usecases/applyToJob/applyToJobInteractor.ts`       | 4, 18   | Usecase parameter typed as concrete `InMemoryJobRepository` instead of the port.                         |
| D1  | DIP       | `src/usecases/applyToJob/applyToJobInteractor.ts`       | 5, 20   | Usecase instantiates `createNotificationClient()` even though `notificationGateway` is already injected. |
| D2  | DIP       | `src/usecases/auditJobEvent/auditJobEventInteractor.ts` | 1, 10   | Usecase imports `axios` and calls `axios.post(AUDIT_URL, ...)` directly (no gateway).                    |
| X1  | DIP       | `src/entities/job.ts`                                   | 38      | Domain uses `console.log(...)` instead of a `LoggerGateway`.                                             |
| X1  | DIP       | `src/usecases/createJob/createJobInteractor.ts`         | 27      | Usecase uses `console.log(...)` instead of a `LoggerGateway`.                                            |
| D4  | DIP       | `src/entities/job.ts`                                   | 35      | `postedAt: new Date()` — no `Clock` gateway.                                                             |
| D4  | DIP       | `src/usecases/applyToJob/applyToJobInteractor.ts`       | 38      | `appliedAt: new Date()` — no `Clock` gateway.                                                            |
| D4  | DIP       | `src/usecases/auditJobEvent/auditJobEventInteractor.ts` | 13      | `at: new Date().toISOString()` — no `Clock` gateway.                                                     |
| D5  | DIP       | `src/usecases/applyToJob/applyToJobInteractor.ts`       | 51, 53  | Usecase reads `process.env.NOTIFICATION_ENABLED` and `process.env.NOTIFICATION_RETRIES`.                 |

## Clean Architecture — Leak / Config

| ID  | Principle      | File                                              | Line(s)  | Detail                                                                            |
| --- | -------------- | ------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| L4  | Framework leak | `src/usecases/searchJobs/searchJobsInteractor.ts` | 1, 28–35 | `searchJobsFromRequest(req: Request)` — Express `Request` consumed by a use case. |
| D3  | Config leak    | `src/entities/job.ts`                             | 20       | Domain reads `process.env.MAX_SALARY` directly.                                   |

## Clean Architecture — SRP (Single Responsibility)

| ID  | Principle | File                                               | Line(s) | Detail                                                                                                        |
| --- | --------- | -------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| #4  | SRP       | `src/application/jobs/listJobsController.ts`       | 19–25   | Controller holds business logic (`.filter(...).filter(...).sort(...)`) instead of delegating to the use case. |
| X3  | SRP       | `src/entities/gateways/jobRepository.ts`           | 12      | Business rule `findActiveHighPayingJobs()` exposed on the gateway.                                            |
| X3  | SRP       | `src/infrastructure/jobs/inMemoryJobRepository.ts` | 40–45   | Repo encodes `salary > HIGH_SALARY_THRESHOLD` filter + sort.                                                  |

## SOLID — OCP (Open/Closed)

| ID  | Principle | File                                                   | Line(s)      | Detail                                                                                                                                                                                                                           |
| --- | --------- | ------------------------------------------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1  | OCP       | `src/usecases/formatJob/formatJobForPlatform.ts`       | 17–27, 30–36 | Growing `if (platform === 'seek') ... else if ... else if ...` chain for salary + postedAt.                                                                                                                                      |
| O2  | OCP       | `src/application/middleware/errorHandlerMiddleware.ts` | 25–57        | Growing `if (isHttpError(err)) ... else if (isApplicationFailedError(err)) ... else if (isSalaryLimitExceededError(err)) ... else if (err.name === 'ZodError') ...` chain — every new error type forces modifying this function. |

## SOLID — LSP (Liskov Substitution)

| ID  | Principle | File                                                              | Line(s) | Detail                                                                                                              |
| --- | --------- | ----------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| Li1 | LSP       | `src/infrastructure/notifications/throttledNotificationClient.ts` | 25–34   | When throttled, returns a synthetic `AxiosResponse` without calling the inner `send`.                               |
| Li2 | LSP       | `src/infrastructure/jobs/readOnlyJobRepository.ts`                | 10–16   | Implements the full `JobRepository` surface but throws on every write (`save`/`update`/`remove`/`saveFromRequest`). |

## SOLID — ISP (Interface Segregation)

| ID  | Principle | File                                                | Line(s) | Detail                                                                                                                                                                   |
| --- | --------- | --------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I1  | ISP       | `src/entities/gateways/jobRepository.ts`            | 3–16    | Fat gateway: CRUD + `findActiveHighPayingJobs` + `getTotalJobsPosted` + `sendWeeklyReport` + `getAverageSalary` on a single interface (lines 12–15 are the extra roles). |
| I2  | ISP       | `src/entities/gateways/jobApplicationRepository.ts` | 3–13    | Fat gateway: CRUD + `archiveOldApplications` + `sendFollowUp` + `exportToCsv` + `getApplicantMetrics` on a single interface (lines 6–12 are the extra roles).            |

## DDD

| ID  | Principle           | File                             | Line(s) | Detail                                                                                                  |
| --- | ------------------- | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| A1  | Anemic domain model | `src/entities/job.ts`            | 3–11    | `Job` is a pure data struct; no `matches`, `isHighPaying`, `withUpdatedSalary` behaviour on the entity. |
| A2  | Primitive obsession | `src/entities/job.ts`            | 9       | `salary: number` — no `Money` / `Salary` value object.                                                  |
| A2  | Primitive obsession | `src/entities/jobApplication.ts` | 5       | `applicantEmail: string` — no `Email` value object.                                                     |

## Error Handling

| ID  | Principle      | File                                              | Line(s) | Detail                                                                                                       |
| --- | -------------- | ------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| E1  | Error Handling | `src/entities/job.ts`                             | 24      | Domain throws generic `new Error(...)` for salary-limit breach (no domain-specific error type, no metadata). |
| E2  | Error Handling | `src/usecases/applyToJob/applyToJobInteractor.ts` | 45–49   | `try { ... } catch (_err) { /* ignored */ }` — legacy notifier failure swallowed silently.                   |
| E2  | Error Handling | `src/usecases/applyToJob/applyToJobInteractor.ts` | 62–64   | `catch (_err)` inside retry loop swallows every attempt failure and falls off the end.                       |
| E2  | Error Handling | `src/usecases/createJob/createJobInteractor.ts`   | 36–38   | `auditJobEvent(...).catch(() => {})` silently swallows audit failures.                                       |
| E2  | Error Handling | `src/usecases/updateJob/updateJobInteractor.ts`   | 17–19   | `auditJobEvent(...).catch(() => {})`.                                                                        |
| E2  | Error Handling | `src/usecases/deleteJob/deleteJobInteractor.ts`   | 13–15   | `auditJobEvent(...).catch(() => {})`.                                                                        |

## Resolved / No longer present

| ID  | Principle       | Original File                             | Status | Detail                                                                                                                                                                                                                           |
| --- | --------------- | ----------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L3  | Dependency Rule | `src/entities/errors/jobNotFoundError.ts` | Fixed  | `JobNotFoundError` was a `class` that `extends HttpError` (imported from the application layer). It is now a factory (`createJobNotFoundError`) returning `Error & { statusCode; jobId }` — no application-layer import remains. |

## Excluded (out of scope)

Not re-injected per decision — these are pure code-style or validation concerns:

- **#1** `any` on controller parameter
- **#2** `as` cast of `req.body`
- **#6** `.then()` chain instead of `async/await`
- **#7** Curried function signature
- **#8** Missing Zod validation on the update endpoint
- **#10** `index.ts` barrel file
