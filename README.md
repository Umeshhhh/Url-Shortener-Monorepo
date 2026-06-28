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

## Run Full Stack With Docker Compose

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Start the full stack:

```powershell
docker compose up --build
```

Services:

```text
Frontend:   http://localhost
Backend:    http://localhost:5000
PostgreSQL: localhost:5433
Redis:      localhost:6379
```

Stop the stack:

```powershell
docker compose down
```

Remove database and Redis volumes:

```powershell
docker compose down -v
```

## Local Development With Docker

Run the complete development stack with source-code hot reload:

```powershell
docker compose -f docker-compose.dev.yml up
```

If the production stack is currently running locally, stop it first with
`docker compose down` so ports 5000 and 6379 are available.

Open the frontend at `http://localhost:5173`. The backend is available at
`http://localhost:5000`. Changes under `frontend/url-shortner/src` refresh in
the browser, and changes under `backend/src` restart the backend automatically.

Stop the development stack with:

```powershell
docker compose -f docker-compose.dev.yml down
```

The development stack uses its own database and Redis volumes. Production is
unchanged and continues to use `docker compose up -d --build` after pulling new
code.

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

### Cloudflare Full (strict) TLS

The default Compose configuration serves HTTP on port 80 for local use. For a
production origin behind Cloudflare, create a Cloudflare Origin CA certificate
and save it as:

```text
deploy/cloudflare/origin.pem
deploy/cloudflare/origin.key
```

Certificate details and hostname guidance are in
`deploy/cloudflare/README.md`. Then start the stack with the strict-TLS
override:

```powershell
docker compose -f docker-compose.yml -f docker-compose.strict.yml up -d --build
```

This exposes HTTPS on port 443, terminates TLS in the frontend Nginx container,
and redirects HTTP traffic to HTTPS. Ensure the host or cloud firewall permits
inbound TCP ports 80 and 443. Before changing Cloudflare's encryption mode, test
the origin directly (replace `ORIGIN_IP`):

```powershell
curl.exe -k --resolve snip.umesh.app:443:ORIGIN_IP https://snip.umesh.app/
```

After the direct request succeeds, set Cloudflare **SSL/TLS encryption mode**
to **Full (strict)** and leave the DNS record proxied. The `-k` flag is only for
this direct diagnostic: Cloudflare Origin CA certificates are trusted by
Cloudflare, not by normal browsers or the operating-system CA store.

Do not expose the origin hostname directly to visitors when using a Cloudflare
Origin CA certificate.

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
