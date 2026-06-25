FROM node:22-bookworm-slim AS build

WORKDIR /app
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"

COPY package*.json prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm ci
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
COPY src/prisma ./src/prisma

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./src/generated

EXPOSE 5000

CMD ["sh", "-c", "npm run prisma:deploy && npm start"]
