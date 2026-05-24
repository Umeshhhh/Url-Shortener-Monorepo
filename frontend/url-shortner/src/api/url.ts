import axios from "axios";

export const url = (url : string) => {

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

    axios.request(config)
    .then((response) => {
        return JSON.stringify(response);
    })
    .catch((error) => {
        console.log(error);
        throw new Error("Error while requesting backend");
    });

}