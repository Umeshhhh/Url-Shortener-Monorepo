import { Request, Response } from "express";
import { urlShortenService } from "../services/urlShortenService";
import { DuplicateShortUrlError, urlDatabaseStoreService } from "../services/urlDatabaseStoreService";
import zod from "zod";
import { urlRedisStoreService } from "../services/urlRedisStoreService";
import { isValidUrl } from "../utils/urlValidator";
import { sanitizeUrl } from "../utils/urlSanitizer";
import { isSSRFSafeUrl } from "../services/ssrfValidation";
import { isReachableURL } from "../services/urlReachabilityCheck";
import { safeBrowsingCheck } from "../services/safeBrowsingCheck";
import { ShortUrlBuilder } from "../builders/ShortUrlBuilder";
import bcrypt from "bcrypt";
import { customAliasValidator } from "../utils/customAliasValidator";

const urlSchema = zod.object({
    url: zod.string(),
    isProtected: zod.boolean(),
    password: zod.string().optional(),
    customAlias: zod.string().optional()
})

export const shortenUrl = async (req : Request, res : Response) => {

    const { url, isProtected, password, customAlias } = req.body;
    if(!url){
        return res.status(400).json({ mssg: "URL is required!!" })
    }

    const result = urlSchema.safeParse({ url, isProtected, password, customAlias });
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
        
        let hashPass = password;
        if(isProtected){
            
            if(!password){
                return res.status(400).json({
                    mssg: "Password cannot be null"
                });
            }
            
            const userPassword = password;
            const SALT_ROUNDS = 12;
            const newPass = await bcrypt.hash(userPassword, SALT_ROUNDS);
            hashPass = newPass;
            
        }
        
        let validAlias = customAlias;
        if(customAlias){
            
            const validation = await customAliasValidator(customAlias);

            if(!validation?.isValid){
                return res.status(validation?.statusCode).json({
                    mssg: validation?.mssg 
                })
            }

            validAlias = validation.correctAlias;
            
        }

        const shortCode = await urlShortenService();
        
        const input = new ShortUrlBuilder()
            .setOriginalUrl(sanitizedUrl)
            .setShortCode(shortCode)
            .setProtection(isProtected, hashPass)
            .setCustomAlias(validAlias)
            .build();

        await urlDatabaseStoreService(input);
        await urlRedisStoreService(input, input.customAlias);

        return res.status(200).json({ 
            message: "URL shortened successfully",
            shortCode : validAlias ? validAlias : shortCode
        });

    }catch(err){
        console.log(err);
        if(err instanceof DuplicateShortUrlError) {
            return res.status(409).json({ mssg: "Short code or custom alias already exists" });
        }

        return res.status(500).json({ mssg: "Internal server error" });
    }


}
