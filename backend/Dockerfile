FROM node:22-bookworm-slim AS build

WORKDIR /app
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"

# Prisma needs OpenSSL to select the correct engine, and CA certificates to
# download/verify that engine during client generation. These packages are
# installed only inside the image and do not alter the host trust store.
COPY docker-certs/ /usr/local/share/ca-certificates/
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm ci
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"

COPY docker-certs/ /usr/local/share/ca-certificates/
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
COPY src/prisma ./src/prisma

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./src/generated

EXPOSE 5000

CMD ["sh", "-c", "npm run prisma:deploy && npm start"]
