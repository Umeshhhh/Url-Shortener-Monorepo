import prisma from "../prisma/prisma";
import { CreateShortUrlInput } from "../types/shortUrlTypes";

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
        throw new Error("Error storing URL data in Database");
        
    }

}
