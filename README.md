# URL Shortner

A full-stack URL shortener built with an Express/TypeScript backend and a React/Vite frontend.

The service validates and sanitizes submitted URLs, checks for SSRF risk and Google Safe Browsing threats, stores URL metadata in PostgreSQL, caches lookups in Redis, supports custom aliases, and can protect links with bcrypt-hashed passwords.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Redis
- React
- Vite
- Zod
- bcrypt
- Nano ID
- Axios

## Project Structure

```text
Url-Shortner/
|-- backend/
|   |-- prisma/
|   |   `-- migrations/
|   |-- src/
|   |   |-- builders/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- prisma/
|   |   |-- redis/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   |-- utils/
|   |   |-- app.ts
|   |   `-- server.ts
|   |-- package.json
|   |-- prisma.config.ts
|   `-- tsconfig.json
|
|-- frontend/
|   `-- url-shortner/
|       |-- src/
|       |   |-- api/
|       |   |-- pages/
|       |   |-- App.tsx
|       |   `-- main.tsx
|       |-- package.json
|       `-- vite.config.ts
|
|-- README.md
`-- .gitignore
```

## Prerequisites

- Node.js
- npm
- PostgreSQL
- Redis
- Google Safe Browsing API key

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/postgres?schema=public"
REDIS_URL="redis://localhost:6379"
GOOGLE_SAFE_BROWSING_API_KEY="your-google-safe-browsing-api-key"
PORT=5000
CORS_ORIGIN="http://localhost:5173"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Create `frontend/url-shortner/.env`:

```env
VITE_API_BASE_URL="http://localhost:5000"
```

## Run Local Services With Docker

PostgreSQL:

```powershell
docker run -d --name url-shortner-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=postgres -p 5433:5432 postgres
```

Redis:

```powershell
docker run -d --name url-shortner-redis -p 6379:6379 redis
```

Start existing containers:

```powershell
docker start url-shortner-postgres
docker start url-shortner-redis
```

## Backend Setup

From `backend/`:

```powershell
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:deploy
npm.cmd run dev
```

The backend runs on:

```text
http://localhost:5000
```

Useful backend scripts:

```text
npm.cmd run dev              Start development server
npm.cmd run build            Compile TypeScript
npm.cmd start                Run compiled server
npm.cmd run prisma:generate  Generate Prisma client
npm.cmd run prisma:validate  Validate Prisma schema
npm.cmd run prisma:deploy    Apply migrations
```

## Frontend Setup

From `frontend/url-shortner/`:

```powershell
npm.cmd install
npm.cmd run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Useful frontend scripts:

```text
npm.cmd run dev      Start Vite dev server
npm.cmd run build    Build production frontend
npm.cmd run lint     Run ESLint
npm.cmd run preview  Preview production build
```

## API Endpoints

### Create Short URL

```http
POST /shorten
```

Request body:

```json
{
  "url": "https://example.com",
  "isProtected": false,
  "customAlias": "my-link"
}
```

For a protected URL:

```json
{
  "url": "https://example.com",
  "isProtected": true,
  "password": "secret-password",
  "customAlias": "private-link"
}
```

Success response:

```json
{
  "message": "URL shortened successfully",
  "shortCode": "my-link"
}
```

### Browser Redirect

```http
GET /:shortCode
```

This returns a `302` redirect to the original URL when the link is not protected.

### Resolve URL As JSON

```http
GET /resolve/:shortCode
```

Success response:

```json
{
  "mssg": "Original Url is retrieved from redis",
  "originalUrl": "https://example.com"
}
```

Protected links return `401` with:

```json
{
  "isProtected": true,
  "mssg": "Password required to access link"
}
```

### Access Protected URL

```http
POST /:shortCode/access
```

Request body:

```json
{
  "urlPassword": "secret-password"
}
```

Success response:

```json
{
  "mssg": "Original Url is retrieved from database",
  "originalUrl": "https://example.com"
}
```

### Check Whether URL Is Protected

```http
GET /isProtected/:shortCode
```

Success response:

```json
{
  "isProtected": true,
  "mssg": "URL is protected"
}
```

## Security Features

- URL protocol validation for `http` and `https`
- URL sanitization for common tracking query parameters
- SSRF checks against private, loopback, unique-local, and link-local IP ranges
- Google Safe Browsing threat checks
- bcrypt hashing for protected URL passwords
- Custom alias validation and reserved-word blocking
- Redis caching for short-code and custom-alias lookups
- Basic request rate limiting
- CORS configuration through environment variables

## Deployment Notes

Set these backend environment variables in production:

```text
DATABASE_URL
REDIS_URL
GOOGLE_SAFE_BROWSING_API_KEY
PORT
CORS_ORIGIN
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX_REQUESTS
```

Set this frontend environment variable:

```text
VITE_API_BASE_URL
```

Backend deployment flow:

```powershell
npm.cmd install
npm.cmd run prisma:deploy
npm.cmd run build
npm.cmd start
```

Frontend deployment flow:

```powershell
npm.cmd install
npm.cmd run build
```

## Development Notes

- Regenerate Prisma after schema changes:

```powershell
npm.cmd run prisma:generate
```

- Apply migrations after schema changes:

```powershell
npm.cmd run prisma:deploy
```
