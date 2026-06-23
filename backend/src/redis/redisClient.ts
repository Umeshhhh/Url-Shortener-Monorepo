import { createClient } from "redis";
import { env } from "../config/env";

class RedisSingleTon {

    private static instance : any;

    static async getinstance() {

        if(!this.instance){

            this.instance = createClient({
                url: env.redisUrl
            });

            this.instance.on("error", (err: any) => {
                console.log("Redis Error" , err);
            })

            await this.instance.connect();

            console.log("Redis Connected");

        }

        return this.instance;

    }

}

export default RedisSingleTon;
