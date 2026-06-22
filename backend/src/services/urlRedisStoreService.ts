import RedisSingleTon from "../redis/redisClient";
import { CreateShortUrlInput } from "../types/shortUrlTypes";


export const urlRedisStoreService = async (
    input: CreateShortUrlInput,
    customAlias: string | null
) => {

    try{
        const redisClient = await RedisSingleTon.getinstance();

        if(customAlias){

            await redisClient.set(customAlias, JSON.stringify(input));

        }
        
        await redisClient.set(input.shortCode, JSON.stringify(input));

    }catch(err) {

        console.log(err);
        console.log("Error while storing data in redis");

    }

}