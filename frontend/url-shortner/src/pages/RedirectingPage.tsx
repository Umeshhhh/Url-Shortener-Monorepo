import axios from "axios";
import { useEffect } from "react";

const RedirectingPage = () => {

    const handleRedirect = async () => {

        const shortCode = window.location.pathname.split("/")[1];
        if(!shortCode || shortCode === "undefined") {
            console.log("No valid short code found in the URL");
            return;
        }

        let data = '';

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:5000/${shortCode}`,
            headers: { },
            data : data
        };

        try{
            const response = await axios.request(config);
            window.location.href = response.data.originalUrl;

        }catch(err){
            console.log(err);
        }

    }

    useEffect(() => {
        handleRedirect();
    },[])

    return(
        <>
        </>
    )

}

export default RedirectingPage;