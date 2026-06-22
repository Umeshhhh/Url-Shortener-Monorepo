export interface CreateShortUrlInput {
    originalUrl: string;
    shortCode: string ;
    isProtected: boolean;
    passwordHash: string | null;
    isActive: boolean;
    oneTimeAccess: boolean;
    customAlias: string | null;
    clickCount: number;
    maxClicks: number | null;
    startsAt: Date | null;
    expiresAt: Date | null;
    qrCode: string | null;
    updatedAt: Date | null;
}
