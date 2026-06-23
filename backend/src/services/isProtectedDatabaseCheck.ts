import prisma from "../prisma/prisma";
import { CreateShortUrlInput } from "../types/shortUrlTypes";

export const isProtectedDatabaseCheck = async (shortCode: string) : Promise<CreateShortUrlInput | null> => {

    try {

        const data = await prisma.shortUrl.findUnique({
            where: {
                shortCode
            }
        });

        if(data) {
            return data;
        }

        const customAlias = await prisma.shortUrl.findUnique({
            where: {
                customAlias: shortCode
            }
        });

        if(customAlias) {
            return customAlias;
        }

        return null;

    }catch(err) {

        console.error("Error occurred while checking protected URL in database: ", err);
        throw err;

    }

}
