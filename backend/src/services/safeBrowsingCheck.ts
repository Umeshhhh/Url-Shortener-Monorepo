import axios from  "axios";

export const safeBrowsingCheck = async (url: string) => {

    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

    const encodedUrl = encodeURIComponent(url);
    const reqUrl = `https://safebrowsing.googleapis.com/v5alpha1/urls:search?key=${apiKey}&urls=${encodedUrl}`;

    try {

        const response = await axios.get(reqUrl);

        if (!response.status || response.status !== 200) {
            console.log("Error response from Safe Browsing API:", response.status, response.statusText);
            return false;
        }
        return true;
    }catch(err) {
        console.log("Error during Safe Browsing API request:", err);
        return false;
    }

}