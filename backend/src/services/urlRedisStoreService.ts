import RedisSingleTon from "../redis/redisClient";


export const urlRedisStoreService = async (shortCode: string, originalUrl: string, isProtected: boolean, password: string | null) => {

    try{
        const redisClient = await RedisSingleTon.getinstance();

        const value = {
            originalUrl,
            isProtected,
            password
        }

        await redisClient.set(shortCode, JSON.stringify(value));

    }catch(err) {

        console.log(err);
        console.log("Error while storing data in redis");

    }

}