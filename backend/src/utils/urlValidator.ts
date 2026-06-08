

export const isValidUrl = (url: string) => {

    try{
        const validUrl = new URL(url);

        return validUrl.protocol === "http:" || validUrl.protocol === "https:";

    }catch(err){

        console.log(err);
        return false;
    }

}