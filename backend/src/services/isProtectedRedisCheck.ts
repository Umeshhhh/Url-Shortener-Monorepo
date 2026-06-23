import RedisSingleTon from "../redis/redisClient";
import { CreateShortUrlInput } from "../types/shortUrlTypes";

export const isProtectedRedisCheck  = async (shortCode: string) : Promise<CreateShortUrlInput | null> => {

    try {

        const redisClient = await RedisSingleTon.getinstance();

        const value = await redisClient.get(shortCode);
        if(value) {

            const data = JSON.parse(value);
            return data;
        }
        
        return null;

    }catch(err) {

        console.error("Error checking Redis for protected URL: ", err);
        return null;
    }

}
