import prisma from "../prisma/prisma";

export const urlStoreService = async (originalUrl: string, shortCode: string) => {

    try{

        await prisma.shortUrl.create({
            data: {
                originalUrl,
                shortCode
            }
        })

    }catch(err){

        console.log(err);
        throw new Error("Error storing URL in database");
        
    }

}