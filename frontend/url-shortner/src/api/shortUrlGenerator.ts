import axios from "axios";

export const shortUrlGenerator = async (url : string) => {

    let data = JSON.stringify({
        "url": `${url}`
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/shorten',
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