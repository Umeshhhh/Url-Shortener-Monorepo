import { createClient } from "redis";

class RedisSingleTon {

    private static instance : any;

    static async getinstance() {

        if(!this.instance){

            this.instance = createClient({
                url: "redis://localhost:6379"
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