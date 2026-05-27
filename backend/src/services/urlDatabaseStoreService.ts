import prisma from "../prisma/prisma";
import RedisSingleTon from "../redis/redisClient";

export const urlDatabaseStoreService = async (originalUrl: string, shortCode: string) => {

    try{

        await prisma.shortUrl.create({
            data: {
                originalUrl,
                shortCode
            }
        });

    }catch(err){

        console.log(err);
        throw new Error("Error storing URL in Database/Redis");
        
    }

}