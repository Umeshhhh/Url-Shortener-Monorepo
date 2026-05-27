import RedisSingleTon from "../redis/redisClient";


export const urlRedisStoreService = async (shortCode: string, originalUrl: string) => {

    try{
        const redisClient = await RedisSingleTon.getinstance();

        await redisClient.set(shortCode, originalUrl);

    }catch(err) {

        console.log(err);
        console.log("Error while storing data in redis");

    }

}