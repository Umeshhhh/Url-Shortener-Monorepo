# URL Shortner

A simple URL shortening project with an Express/TypeScript backend and a prepared folder structure for a future React frontend.

The backend accepts a long URL, stores it in PostgreSQL with a generated short code, and lets users resolve that short code back to the original URL.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Docker
- Zod
- Nano ID

The `frontend/` folder is currently only a scaffold. React has not been initialized yet.

## Project Structure

```text
Url-Shortner/
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- generated/
|   |   |-- middlewares/
|   |   |-- prisma/
|   |   |   |-- prisma.ts
|   |   |   `-- schema.prisma
|   |   |-- routes/
|   |   |-- services/
|   |   |-- app.ts
|   |   `-- server.ts
|   |-- prisma/
|   |-- package.json
|   |-- package-lock.json
|   |-- prisma.config.ts
|   |-- tsconfig.json
|   `-- .env
|
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   `-- pages/
|   `-- public/
|
|-- README.md
`-- .gitignore
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- Docker Desktop

## Environment Variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/postgres?schema=public"
PORT=5000
```

Do not commit `.env` to GitHub. Use `.env.example` for sample values if needed.

## Run PostgreSQL With Docker

This project uses host port `5433` to avoid conflicts with any local PostgreSQL running on `5432`.

```powershell
docker run -d --name url-shortner-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=postgres -p 5433:5432 postgres
```

If the container already exists, start it with:

```powershell
docker start url-shortner-postgres
```

## Install Backend Dependencies

```powershell
cd backend
npm.cmd install
```

On Windows PowerShell, `npm.cmd` avoids script execution policy issues that can block `npm`.

## Set Up Prisma

Run these commands from the `backend/` folder:

```powershell
npm.cmd run prisma:generate
npx.cmd prisma db push
```

## Run Backend In Development

From `backend/`:

```powershell
npm.cmd run dev
```

The server runs on:

```text
http://localhost:5000
```

## Build The Backend

From `backend/`:

```powershell
npm.cmd run build
```

Compiled JavaScript is generated in `backend/dist/`.

## Run Backend In Production Mode

From `backend/`:

```powershell
npm.cmd run build
npm.cmd start
```

## API Endpoints

### Create Short URL

```http
POST /shorten
```

Request body:

```json
{
  "url": "https://example.com"
}
```

Success response:

```json
{
  "message": "URL shortened successfully",
  "newUrl": "http://localhost:5000/abc123XY"
}
```

### Resolve Short URL

```http
GET /:shortCode
```

Example:

```text
GET http://localhost:5000/abc123XY
```

The API looks up the original URL for the given short code.

## Frontend

The `frontend/` folder is ready for a future React app, but React has not been initialized.

When you are ready, you can initialize it with Vite from the project root:

```powershell
npm create vite@latest frontend -- --template react-ts
```

## Useful Backend Scripts

Run these from `backend/`:

```text
npm.cmd run dev              Start development server
npm.cmd run build            Compile TypeScript
npm.cmd start                Run compiled server
npm.cmd run prisma:generate  Generate Prisma client
npm.cmd run prisma:validate  Validate Prisma schema
```

## Notes

- Keep `backend/.env` private.
- Use `localhost:5433` for the Docker PostgreSQL database.
- If you change `backend/src/prisma/schema.prisma`, run `npx.cmd prisma db push` and `npm.cmd run prisma:generate` again from `backend/`.
