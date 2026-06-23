import axios from "axios";
import { API_BASE_URL } from "./config";

export const shortUrlGenerator = async (url : string) => {

    let data = JSON.stringify({
        "url": `${url}`,
        "isProtected": false
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_BASE_URL}/shorten`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    try{
        const response = await axios.request(config)
        return response.data;
    }catch(err){
        console.log(err);
        throw new Error("Error while requesting backend");
    }

}
