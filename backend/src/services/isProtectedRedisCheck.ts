import RedisSingleTon from "../redis/redisClient";

export const isProtectedRedisCheck  = async (shortCode: string) : Promise<boolean> => {

    const redisClient = await RedisSingleTon.getinstance();

    try {

        const value = await redisClient.get(shortCode);
        if(value) {

            const data = JSON.parse(value);

            if(data.isProtected){
                return true;
            }
        }
        
        return false;

    }catch(err) {

        console.error("Error checking Redis for protected URL: ", err);
        return false;
    }

}