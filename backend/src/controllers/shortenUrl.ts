import { Request, Response } from "express";
import { urlShortenService } from "../services/urlShortenService";
import { urlStoreService } from "../services/urlStoreService";
import zod from "zod";

const urlSchema = zod.object({
    url: zod.string()
})

export const shortenUrl = async (req : Request, res : Response) => {

    const { url } = req.body;
    if(!url){
        return res.status(400).json({ mssg: "URL is required!!" })
    }
    const result = urlSchema.safeParse({ url });
    if(!result.success){
        return res.status(400).json({ mssg: "Invalid URL format!!" })
    }

    try{
        
        const shortCode = await urlShortenService();
        const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
        
        await urlStoreService(url, shortUrl, shortCode);

        return res.status(200).json({ 
            message: "URL shortened successfully",
            newUrl: shortUrl
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({ mssg: "Internal server error" });
    }


}