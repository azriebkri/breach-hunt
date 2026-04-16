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

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| POST   | `/api/jobs`                     | Create a job posting           |
| GET    | `/api/jobs`                     | List/search jobs               |
| GET    | `/api/jobs/:id`                 | Get a specific job             |
| PUT    | `/api/jobs/:id`                 | Update a job posting           |
| DELETE | `/api/jobs/:id`                 | Delete a job posting           |
| POST   | `/api/jobs/:id/applications`    | Apply to a job                 |
| GET    | `/api/jobs/:id/applications`    | List applications for a job    |

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

---

## Architecture Overview

This codebase follows **Clean Architecture** with four layers:

```
src/
  domain/       → Models, Ports (interfaces), Domain Errors
  application/  → Services, Formatters (business logic)
  infrastructure/ → Repositories, External Clients, Utilities
  api/          → Controllers, Middleware, Schemas, Routes
```

**The Dependency Rule**: source code dependencies must point **inward**.
- `domain` depends on nothing
- `application` depends on `domain`
- `infrastructure` implements `domain` ports
- `api` orchestrates everything

---

## The Breach Hunt Rules

### Your Mission

This codebase has **at least 10 intentional violations** of clean architecture principles, SOLID principles, and coding standards baked in. Your job is to find and document every single one.

### What Counts as a Violation

Violations fall into categories including (but not limited to):
- Clean Architecture dependency rule breaches
- SOLID principle violations
- TypeScript/coding style anti-patterns
- Missing validation
- Improper error handling patterns

### Scoring

| Action                                           | Points |
| ------------------------------------------------ | ------ |
| Correctly identify a violation                   | 1 pt   |
| Name the correct fix                             | +1 pt  |
| Find the hidden "sneaky" violation               | Bonus  |

### How to Document Findings

For each violation, record:
1. **File** and **line** where the violation occurs
2. **What** the violation is (1-2 sentences)
3. **Which principle** it breaks
4. **How to fix it** (for the extra point)

### Rules

- Do NOT modify the tests in `test/componentTests/` — they are your safety net
- You may read any file in the codebase
- Time limit: **45 minutes**

Good luck, and may the cleanest team win!
