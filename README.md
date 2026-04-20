# Breach Hunt: Job Posting Service

A small but realistic SEEK-like job posting API, built with clean architecture in TypeScript.

**Your mission**: find every clean architecture violation hidden in this codebase.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install & Run

```bash
pnpm install
pnpm start        # starts the API on http://localhost:3000
pnpm dev          # starts with auto-reload
```

### Run Tests

```bash
pnpm test
pnpm test:watch   # re-runs on file changes
```

All tests should pass. The violations are **architectural**, not functional.

---

## API Endpoints

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/api/jobs`                     | Create a job posting             |
| GET    | `/api/jobs`                     | List jobs                        |
| GET    | `/api/jobs/search`              | Search jobs (by location/salary) |
| GET    | `/api/jobs/featured`            | List featured (high-paying) jobs |
| GET    | `/api/jobs/by-company/:company` | List jobs for a given company    |
| GET    | `/api/jobs/:id`                 | Get a specific job               |
| PUT    | `/api/jobs/:id`                 | Update a job posting             |
| DELETE | `/api/jobs/:id`                 | Delete a job posting             |
| POST   | `/api/jobs/:id/applications`    | Apply to a job                   |
| GET    | `/api/jobs/:id/applications`    | List applications for a job      |

### Example: Create a Job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "description": "Build amazing products",
    "company": "SEEK",
    "location": "Melbourne",
    "salary": 150000
  }'
```

### Example: Apply to a Job

```bash
curl -X POST http://localhost:3000/api/jobs/<jobId>/applications \
  -H "Content-Type: application/json" \
  -d '{
    "applicantName": "Ada Lovelace",
    "applicantEmail": "ada@example.com",
    "coverLetter": "I love building things."
  }'
```

---

## Architecture Overview

This codebase follows **Clean Architecture** with four concentric layers:

```
src/
  entities/        → Domain models, Gateways (ports), Domain Errors
  usecases/        → Interactors (application-specific business rules)
  application/     → Controllers, Middleware, Schemas, Routers (interface adapters)
  infrastructure/  → Repositories, External Clients, Clock, IdGenerator, Logger
```

**The Dependency Rule**: source code dependencies must point **inward**.

- `entities` depends on nothing
- `usecases` depends only on `entities`
- `application` (interface adapters) depends on `usecases` + `entities`
- `infrastructure` implements `entities` ports
- The composition root (`src/app.ts`) wires everything together

---

## The Breach Hunt Rules

### Your Mission

This codebase has **many intentional violations** of clean architecture principles. Your job is to find and document at least minimum 10 violation.

### What Counts as a Violation

Violations fall into categories including (but not limited to):

- Clean Architecture dependency rule breaches (inner layers reaching outward)
- Dependency Inversion violations (depending on concretions, not abstractions)
- Framework / transport / config leaks into inner layers
- Misplaced responsibilities (business logic in adapters, messaging in repositories, presentation in domain, etc.)

### Scoring

| Action                         | Points |
| ------------------------------ | ------ |
| Correctly identify a violation | 1 pt   |
| Name the correct fix           | +1 pt  |

### How to Document Findings

For each violation, record:

1. **Create** a pull request to merge into **master**
1. **File** and **line** where the violation occurs
1. **What** the violation is (1-2 sentences)
1. **Which principle** it breaks
1. **How to fix it**

### Rules

- Do NOT modify the tests in `test/componentTests/` — they are your safety net
- You may read any file in the codebase
- Time limit: **60 minutes**

Good luck, and may the cleanest team win!
