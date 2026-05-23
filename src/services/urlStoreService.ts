import prisma from "../prisma/prisma";

export const urlStoreService = async (originalUrl: string, shortUrl: string, shortCode: string) => {

    try{

        await prisma.shortUrl.create({
            data: {
                originalUrl,
                shortCode,
                shortUrl
            }
        })

    }catch(err){

        console.log(err);
        throw new Error("Error storing URL in database");
        
    }

}