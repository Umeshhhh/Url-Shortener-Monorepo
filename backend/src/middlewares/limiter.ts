import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const requests = new Map<string, RateLimitEntry>();


export const limiter = (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const current = requests.get(ip);

    if (!current || current.resetAt <= now) {
        requests.set(ip, {
            count: 1,
            resetAt: now + env.rateLimitWindowMs
        });

        return next();
    }

    if (current.count >= env.rateLimitMaxRequests) {
        const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
        res.setHeader("Retry-After", String(retryAfterSeconds));

        return res.status(429).json({
            mssg: "Too many requests"
        });
    }

    current.count += 1;

    next();

}
