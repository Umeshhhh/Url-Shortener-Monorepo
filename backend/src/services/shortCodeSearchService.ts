import prisma from "../prisma/prisma"

export const shortCodeSerarchService = async (shortCode : string) : Promise<{
    originalUrl: string,
    shortCode: string,
    createdAt: Date,
    clicks: number
    isProtected: boolean,
    password: string | null,
} | null> => {

    try{

        const url = await prisma.shortUrl.findUnique({
            where: {
                shortCode
            }
        });

        if(!url){
            return null;
        }

        const updated = await prisma.shortUrl.update({
            where: { shortCode },
            data : {
                clicks: {
                    increment: 1
                }
            }
        });

        return updated;

    }catch{}{

        throw new Error("Unable to retrieve url");

    }

}