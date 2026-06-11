import prisma from "../prisma/prisma";

export const urlDatabaseStoreService = async (originalUrl: string, shortCode: string, isProtected: boolean, password: string | null) => {

    try{

        await prisma.shortUrl.create({
            data: {
                originalUrl,
                shortCode,
                isProtected,
                password
            }
        });

    }catch(err){

        console.log(err);
        throw new Error("Error storing URL in Database/Redis");
        
    }

}