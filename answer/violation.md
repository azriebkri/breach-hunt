## Clean Architecture — Layering (Dependency Rule)

| ID  | Principle       | File                                                       | Line(s)   | Detail                                                                                                                                                                                    |
| --- | --------------- | ---------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L7  | Dependency Rule | `src/entities/job.ts`                                      | 2, 42–57  | Domain imports `CreateJobRequest` from `src/application/jobs/jobSchemas.ts` (API layer) and exposes `createJobFromRequest(...)` — inner layer depending on an outer-layer transport shape. |
| L8  | Dependency Rule / Framework leak | `src/usecases/listJobs/listJobsInteractor.ts` | 1, 42–48  | Usecase imports `express.Request` and exports `getAllJobsFromRequest(req: Request)` — Express transport type reaches into a use case.                                                     |
| L9  | Dependency Rule | `src/entities/job.ts`                                      | 1, 32     | Domain imports `randomUUID` from Node's `crypto` module and uses it as a fallback id — entity depends on a framework primitive, bypassing the `IdGenerator` port.                          |
| L10 | Dependency Rule | `src/usecases/getFeaturedJobs/getFeaturedJobsInteractor.ts` | 3, 21    | Usecase imports `computeJobPriorityScore` from `infrastructure/jobs/jobPriorityScore` — inner (use case) reaching outward into infrastructure for a ranking rule.                          |

## Clean Architecture — Dependency Inversion (DIP)

| ID  | Principle | File                                                    | Line(s)      | Detail                                                                                                                                                                                                                            |
| --- | --------- | ------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D9  | DIP / Config leak | `src/infrastructure/notifications/throttledNotificationClient.ts` | 16–17, 24–29 | Decorator reads `process.env.NOTIFICATION_API_URL` at module load and auto-instantiates a concrete `createNotificationClient({...})` when `inner` is omitted — infra performs its own composition and hides the real dependency from the composition root. |
| D10 | DIP       | `src/usecases/applyToJob/applyToJobInteractor.ts`       | 76           | Usecase records `at: Date.now()` in a log context even though a `Clock` port is already injected — bypasses the abstraction for a system-time side-channel.                                                                        |
| D11 | Config leak in usecase | `src/usecases/listJobs/listJobsInteractor.ts` | 31–37       | Usecase reads `process.env.LIST_LIMIT` to cap results — application-level config pulled into a use case instead of being passed in.                                                                                                |

## Clean Architecture — Framework & Config Leaks

| ID  | Principle      | File                                             | Line(s)      | Detail                                                                                                                                                                                           |
| --- | -------------- | ------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D12 | Framework leak in domain error | `src/entities/errors/applicationFailedError.ts` | 1–4, 18–21 | `ApplicationFailedError` defines an `HttpErrorPayload` type and a `toHttpPayload()` method returning `{ status: 400, body }` — HTTP transport concerns embedded directly in a domain error.       |

## Clean Architecture — Misplaced Responsibility

| ID  | Principle                    | File                                                          | Line(s) | Detail                                                                                                                                                                                          |
| --- | ---------------------------- | ------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M4  | Controller bypasses usecase  | `src/application/jobApplications/getApplicationsController.ts` | 11–13   | Controller calls `deps.applicationRepository.findByJobId(...)` directly and does not depend on a `getApplicationsForJob` interactor at all — the use-case layer has been skipped.                |
| X4  | Presentation in domain       | `src/entities/jobApplication.ts`                              | 10–28   | Domain file declares `JobApplicationApiResponse` (snake_case) and a `toApiResponse(...)` mapper — API presentation / serialisation logic placed inside an entity module.                         |
