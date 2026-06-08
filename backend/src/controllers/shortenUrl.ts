import { Request, Response } from "express";
import { urlShortenService } from "../services/urlShortenService";
import { urlDatabaseStoreService } from "../services/urlDatabaseStoreService";
import zod from "zod";
import { urlRedisStoreService } from "../services/urlRedisStoreService";
import { isValidUrl } from "../utils/urlValidator";
import { sanitizeUrl } from "../utils/urlSanitizer";
import { isSSRFSafeUrl } from "../services/ssrfValidation";
import { isReachableURL } from "../services/urlReachabilityCheck";
import { safeBrowsingCheck } from "../services/safeBrowsingCheck";

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

        if(!isValidUrl(url)){
            throw new Error("Invalid URL provided!!");
        }

        const sanitizedUrl = sanitizeUrl(url);
        if(!sanitizedUrl){
            throw new Error("URL sanitization failed!!");
        }

        const ssrfSafe = await isSSRFSafeUrl(sanitizedUrl);
        if(!ssrfSafe){
            throw new Error("URL failed SSRF validation!!");
        }

        const reachableUrl = await isReachableURL(sanitizedUrl);
        if(!reachableUrl){
            throw new Error("URL is not reachable!!");
        }

        const safeUrl = await safeBrowsingCheck(sanitizedUrl);
        if(!safeUrl){
            throw new Error("URL is not safe!!");
        }

        const shortCode = await urlShortenService();
        
        await urlDatabaseStoreService(url, shortCode);
        await urlRedisStoreService(url, shortCode);

        return res.status(200).json({ 
            message: "URL shortened successfully",
            shortCode
        });

    }catch(err){
        console.log(err);
        return res.status(500);
    }


}