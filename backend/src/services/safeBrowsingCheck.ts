

export const safeBrowsingCheck = async (url: string) => {

    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

    const reqUrl = `https://safebrowsing.googleapis.com/v5alpha1/urls:search?key=${apiKey}&urls=${url}`;

    try {

        const response = await fetch(reqUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);

        if (!response.ok) {
            console.log("Error response from Safe Browsing API:", response.status, response.statusText);
            return false;
        }
        return true;
    }catch(err) {
        console.log("Error during Safe Browsing API request:", err);
        return false;
    }

}