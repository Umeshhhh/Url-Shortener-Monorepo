import RedisSingleTon from "../redis/redisClient";


export const redisUrlSearch = async (shortCode : string) => {

    try{
        const redisClient = await RedisSingleTon.getinstance();

        const value = await redisClient.get(shortCode);

        if(value) {
            console.log("Redis Hit");
            return JSON.parse(value);
        }

        throw new Error("Redis miss error");

    }catch(err){
        console.log(err);
        console.log("Redis Error");
    }

}