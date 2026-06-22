import prisma from "../prisma/prisma"
import { CreateShortUrlInput } from "../types/shortUrlTypes";

export const shortCodeSearchService = async (shortCode : string) : Promise<CreateShortUrlInput | null> => {

    try{

        const url = await prisma.shortUrl.findUnique({
            where: {
                shortCode
            }
        });

        if(!url){
            
            const customCode = await prisma.shortUrl.findUnique({
                where: {
                    customAlias : shortCode
                }
            });

            if(!customCode) return null;

            const updated = await prisma.shortUrl.update({
                where: { 
                    customAlias: shortCode
                },
                data : {
                    clickCount: {
                        increment: 1
                    }
                }
            });

            return updated;

        }

        const updated = await prisma.shortUrl.update({
            where: { shortCode },
            data : {
                clickCount: {
                    increment: 1
                }
            }
        });

        return updated;

    }catch{}{

        throw new Error("Unable to retrieve url");

    }

}
