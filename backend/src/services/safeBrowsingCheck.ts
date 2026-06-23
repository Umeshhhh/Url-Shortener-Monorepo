import axios from  "axios";
import { env } from "../config/env";

export const safeBrowsingCheck = async (url: string) => {

    const apiKey = env.googleSafeBrowsingApiKey;
    if (!apiKey) {
        console.log("Google Safe Browsing API key is missing");
        return false;
    }

    const reqUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    try {

        const response = await axios.post(reqUrl, {
            client: {
                clientId: "url-shortner",
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: [
                    "MALWARE",
                    "SOCIAL_ENGINEERING",
                    "UNWANTED_SOFTWARE",
                    "POTENTIALLY_HARMFUL_APPLICATION"
                ],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url }]
            }
        }, {
            timeout: 5000
        });

        if (!response.status || response.status !== 200) {
            console.log("Error response from Safe Browsing API:", response.status, response.statusText);
            return false;
        }

        return !response.data?.matches?.length;
    }catch(err) {
        console.log("Error during Safe Browsing API request:", err);
        return false;
    }

}
