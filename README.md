# Vacation Management

A small full-stack app for submitting and reviewing vacation requests. Two interfaces — Requester and Validator — share one REST API and a PostgreSQL database.

## Stack

- **Frontend** — Vue 3, TypeScript, Vite, PrimeVue (with `@primevue/forms` + yup for validation), Axios, SCSS modules.
- **Backend** — Node.js, Express 5, TypeScript, TypeORM, PostgreSQL.
- **Tests** — Jest + Supertest on the backend.
- **Database** — Postgres 16 in Docker.

## Run it locally

You'll need Node 18+ and Docker.

**1. Start the database** (from the project root):

```bash
docker compose up -d
```

This brings up Postgres on `localhost:5432` with the database `vacation_db`.

**2. Backend:**

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # adds two users: Alice (Requester), Bob (Validator)
npm run dev      # API on http://localhost:3000
```

**3. Frontend** (in another terminal):

```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # SPA on http://localhost:5173
```

Open `http://localhost:5173`, pick a user, and you'll land on the matching interface.

## Tests

The backend has integration tests covering the API. They use a separate database so dev data is not touched.

Create the test database once:

```bash
docker exec travel_factory_db psql -U postgres -c "CREATE DATABASE vacation_db_test;"
```

Then:

```bash
cd backend
cp .env.test.example .env.test
npm test
```

There are 7 tests — happy paths and the main error cases for each endpoint.

## API

Base URL: `http://localhost:3000`

| Method | Path                       | What it does                       |
|--------|----------------------------|------------------------------------|
| GET    | `/users`                   | All users                          |
| GET    | `/requests?userId=:id`     | Requests, optionally by user       |
| POST   | `/requests`                | Create a request                   |
| PATCH  | `/requests/:id/approve`    | Approve a pending request          |
| PATCH  | `/requests/:id/reject`     | Reject a pending request           |

Create body:

```json
{
  "userId": 1,
  "startDate": "2026-06-01",
  "endDate": "2026-06-10",
  "reason": "Family trip"
}
```

Reject body:

```json
{ "comments": "Period overloaded" }
```

## How it's organised

**Backend** uses a typical layered structure: `routes → controllers → services`. Controllers parse the request and call a service; services hold the actual logic and talk to the database via TypeORM repositories. Errors are thrown as `HttpError(status, message)` and a single error middleware turns them into JSON responses.

For input checks I wrote a few small helpers (`parseIdParam`, `parseRequiredString`, etc.) instead of pulling in a schema library — felt simpler for the size of the project.

The `VacationRequest` entity has an eager relation to `User`, so the user is included in every response without asking for it explicitly.

**Frontend** is a small Vue 3 SPA. API calls live under `src/api/`, and there are two composables that wrap the data layer:

- `useUsers` — for the home page;
- `useRequests` — load + create + approve + reject for both Requester and Validator pages.

The composables handle loading state, errors and toasts internally. Mutation methods return the updated object on success or `null` on failure, so pages can do `if (!created) return` instead of try/catch blocks.

For form reset I use the `:key` trick on `<Form>` (incrementing a counter remounts it with `initialValues`) — cleaner than relying on PrimeVue's internal `reset()` which isn't typed.

## What's intentionally not in scope

- **No auth.** The user is picked on the home screen and stored in `localStorage`; the backend doesn't check who is calling. Out of scope for the assignment.
- **No role check on the backend.** A Requester could call `/approve` directly via curl. The frontend doesn't let them, but proper enforcement would live in middleware.
- **`synchronize: true`** in TypeORM — schema is auto-derived from entities. Convenient for development, but in real life you'd write migrations.
- **No pagination.** Fine while there are a handful of requests.
- **CORS open to everything.** `cors()` with no options.
- **Frontend tests** were skipped — the assignment asks for unit *or* integration tests, and integration tests on the backend felt like the higher-value choice for this codebase.
