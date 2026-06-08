import axios from "axios";

export const isReachableURL = async (urlString: string) : Promise<boolean> => {

    try {

        await axios.head(urlString, {
            timeout: 5000,
            maxRedirects: 5,
        });

        return true;
    }catch(err) {
        return false;
    }

}