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
    url: zod.string(),
    isProtected: zod.boolean(),
    password: zod.string().optional()
})

export const shortenUrl = async (req : Request, res : Response) => {

    const { url, isProtected, password } = req.body;
    if(!url){
        return res.status(400).json({ mssg: "URL is required!!" })
    }

    const result = urlSchema.safeParse({ url, isProtected, password });
    if(!result.success){
        return res.status(400).json({ mssg: "Invalid URL format!!" })
    }

    try{

        if(!isValidUrl(url)){
            return res.status(400).json({ mssg: "Invalid URL format!!" });
        }

        const sanitizedUrl = sanitizeUrl(url);
        if(!sanitizedUrl){
            return res.status(400).json({ mssg: "URL sanitization failed!!" });
        }

        const ssrfSafe = await isSSRFSafeUrl(sanitizedUrl);
        if(!ssrfSafe){
            return res.status(400).json({ mssg: "URL is potentially vulnerable to SSRF attacks!!" });
        }

        const reachableUrl = await isReachableURL(sanitizedUrl);
        if(!reachableUrl){
            console.warn(`URL is not reachable: ${sanitizedUrl}`);
        }

        const safeUrl = await safeBrowsingCheck(sanitizedUrl);
        if(!safeUrl){
            return res.status(400).json({ mssg: "URL is not safe!!" });
        }

        const shortCode = await urlShortenService();

        if(isProtected){
            await urlDatabaseStoreService(sanitizedUrl, shortCode, isProtected, password);
            await urlRedisStoreService(sanitizedUrl, shortCode, isProtected, password);
        }else{
            await urlDatabaseStoreService(sanitizedUrl, shortCode, isProtected, null);
            await urlRedisStoreService(sanitizedUrl, shortCode, isProtected, null);
        }

        return res.status(200).json({ 
            message: "URL shortened successfully",
            shortCode
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({ mssg: "Internal server error" });
    }


}