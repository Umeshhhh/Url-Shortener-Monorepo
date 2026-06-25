import { CreateShortUrlInput } from "../types/shortUrlTypes";

export class ShortUrlBuilder {
    private shortUrl: CreateShortUrlInput = {
        originalUrl: "",
        shortCode: "",
        isProtected: false,
        passwordHash: null,
        isActive: true,
        oneTimeAccess: false,
        customAlias: null,
        clickCount: 0,
        maxClicks: null,
        startsAt: null,
        expiresAt: null,
        qrCode: null,
        updatedAt: null,
    };

    private ShortUrlBuilder() {}

    setOriginalUrl(originalUrl: string): this {
        this.shortUrl.originalUrl = originalUrl;
        return this;
    }

    setShortCode(shortCode: string): this {
        this.shortUrl.shortCode = shortCode;
        return this;
    }

    setProtection(isProtected: boolean, password?: string): this {
        this.shortUrl.isProtected = isProtected;
        this.shortUrl.passwordHash = isProtected ? password ?? null : null;
        return this;
    }

    setCustomAlias(customAlias?: string): this {
        this.shortUrl.customAlias = customAlias?.trim() || null;
        return this;
    }

    setMaxClicks(maxClicks?: number | null): this {
        this.shortUrl.maxClicks = maxClicks ?? null;
        return this;
    }

    setAvailability(startsAt?: Date | null, expiresAt?: Date | null): this {
        this.shortUrl.startsAt = startsAt ?? null;
        this.shortUrl.expiresAt = expiresAt ?? null;
        return this;
    }

    setOneTimeAccess(oneTimeAccess: boolean): this {
        this.shortUrl.oneTimeAccess = oneTimeAccess;
        return this;
    }

    setQrCode(qrCode?: string | null): this {
        this.shortUrl.qrCode = qrCode ?? null;
        return this;
    }

    build(): CreateShortUrlInput {
        if (!this.shortUrl.originalUrl) {
            throw new Error("Original URL is required");
        }

        if (!this.shortUrl.shortCode) {
            throw new Error("Short code is required");
        }

        if (this.shortUrl.isProtected && !this.shortUrl.passwordHash) {
            throw new Error("Password is required for protected URLs");
        }

        return { ...this.shortUrl };
    }
}
