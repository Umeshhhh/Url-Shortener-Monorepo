import "../App.css";
import { useState, useEffect } from "react";
import { url } from "../api/url";
import axios from "axios";

interface URLResponse {
    message: string;
    newUrl: string;
}

const LandingPage = () => {

    const [webUrl, setWebUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [isShortened, setIsShortened] = useState(false);
    const [emptyUrlError, setEmptyUrlError] = useState(false);

    const handleShorting = async () => {

        if(webUrl === ""){
            setEmptyUrlError(true);
            return;
        }
        setEmptyUrlError(false);
        try{
            let data = JSON.stringify({
                "url": `${webUrl}`
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
                setShortUrl(response.data.newUrl);
            })
            .catch((error) => {
                console.log(error);
                throw new Error("Error while requesting backend");
            });
            // const response = await url(webUrl);
            // const extractedResponse: URLResponse = typeof response === "string" ? JSON.parse(response) : (response as any);
            // console.log(extractedResponse);
            // setShortUrl(extractedResponse.newUrl);
            setIsShortened(true);
        }catch(err){
            console.log(err);
            setIsShortened(false);
        }
        
    }

    useEffect(() => {
        setEmptyUrlError(false);
    }, [webUrl])

    return(
        <div>
            <h1 className="w-full text-center text-3xl font-semibold">Landing Page</h1>
            <br />
            <form onSubmit={(e) => {
                e.preventDefault();
            }} className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md flex flex-col items-center px-4 py-5 space-y-2">
                <section className="w-full">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 w-full">Enter URL to shorten: </label>
                    <input 
                        type="text"
                        id="url"
                        placeholder="Enter URL to shorten"
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                        className="mt-2 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </section>
                <button 
                    onClick={handleShorting}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Shorten
                </button>
            </form>
            {isShortened && (
                <div>
                    <h3>Here's Your short URL...</h3>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{shortUrl}</a>
                </div>
            )}
            {emptyUrlError && (
                <p className="text-red-500 w-full text-center">Please enter a valid URL.</p>
            )}
        </div>
    )
}

export default LandingPage;