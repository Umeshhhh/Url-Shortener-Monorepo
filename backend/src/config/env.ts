const optionalNumber = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
    port: optionalNumber(process.env.PORT, 5000),
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    corsOrigins: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean),
    googleSafeBrowsingApiKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY,
    rateLimitWindowMs: optionalNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    rateLimitMaxRequests: optionalNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
};

export const validateEnv = () => {
    if (!env.databaseUrl) {
        throw new Error("DATABASE_URL is required");
    }

    if (!env.googleSafeBrowsingApiKey) {
        throw new Error("GOOGLE_SAFE_BROWSING_API_KEY is required");
    }
};
