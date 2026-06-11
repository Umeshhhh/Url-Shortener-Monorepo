import RedisSingleTon from "../redis/redisClient";

export const isProtectedRedisCheck  = async (shortCode: string) : Promise<Object | null> => {

    const redisClient = await RedisSingleTon.getinstance();

    try {

        const value = await redisClient.get(shortCode);
        if(value) {

            const data = JSON.parse(value);

            if(data.isProtected){

                return data;
            }

            return null;
        }
        
        return null;

    }catch(err) {

        console.error("Error checking Redis for protected URL: ", err);
        return null;
    }

}