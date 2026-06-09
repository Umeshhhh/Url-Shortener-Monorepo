import axios from "axios";

export const isReachableURL = async (urlString: string) : Promise<boolean> => {

    try {

        const response = await axios.get(urlString, {
            timeout: 5000,
            maxRedirects: 5,
            validateStatus: () => true
        })

        return response.status > 0;

    }catch {
        return false;
    }

}