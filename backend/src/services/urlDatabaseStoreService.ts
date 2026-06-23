import prisma from "../prisma/prisma";
import { CreateShortUrlInput } from "../types/shortUrlTypes";

export class DuplicateShortUrlError extends Error {
    constructor() {
        super("Short code or custom alias already exists");
        this.name = "DuplicateShortUrlError";
    }
}

export const urlDatabaseStoreService = async (
    input: CreateShortUrlInput
) => {

    try{

        await prisma.shortUrl.create({
            data: {
                originalUrl: input.originalUrl,
                shortCode: input.shortCode,
                isProtected: input.isProtected,
                passwordHash: input.passwordHash,
                isActive: input.isActive,
                oneTimeAccess: input.oneTimeAccess,
                customAlias: input.customAlias,
                clickCount: input.clickCount,
                maxClicks: input.maxClicks,
                startsAt: input.startsAt,
                expiresAt: input.expiresAt,
                qrCode: input.qrCode,
                updatedAt: input.updatedAt
            }
        });

    }catch(err){

        console.log(err);
        if((err as { code?: string }).code === "P2002") {
            throw new DuplicateShortUrlError();
        }

        throw new Error("Error storing URL data in Database");
        
    }

}
