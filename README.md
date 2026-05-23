# URL Shortner

A simple URL shortening API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

The API accepts a long URL, stores it in PostgreSQL with a generated short code, and lets users resolve that short code back to the original URL.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Docker
- Zod
- Nano ID

## Project Structure

```text
.
|-- src/
|   |-- controllers/
|   |-- generated/
|   |-- middlewares/
|   |-- prisma/
|   |   |-- prisma.ts
|   |   `-- schema.prisma
|   |-- routes/
|   |-- services/
|   |-- app.ts
|   `-- server.ts
|-- prisma.config.ts
|-- package.json
|-- tsconfig.json
`-- .env
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- Docker Desktop

## Environment Variables

Create a `.env` file in the project root:

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

## Install Dependencies

```powershell
npm install
```

On Windows PowerShell, prefer `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd install
```

## Set Up Prisma

Generate the Prisma client:

```powershell
npm.cmd run prisma:generate
```

Push the schema to the database:

```powershell
npx.cmd prisma db push
```

## Run In Development

```powershell
npm.cmd run dev
```

The server runs on:

```text
http://localhost:5000
```

## Build The Project

```powershell
npm.cmd run build
```

Compiled JavaScript is generated in `dist/`.

## Run In Production Mode

Build first:

```powershell
npm.cmd run build
```

Then start:

```powershell
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

## Useful Scripts

```text
npm.cmd run dev              Start development server
npm.cmd run build            Compile TypeScript
npm.cmd start                Run compiled server
npm.cmd run prisma:generate  Generate Prisma client
npm.cmd run prisma:validate  Validate Prisma schema
```

## Notes

- Keep `.env` private.
- Use `localhost:5433` for the Docker PostgreSQL database.
- If you change `schema.prisma`, run `npx.cmd prisma db push` and `npm.cmd run prisma:generate` again.
