import { Request, Response } from "express";
import zod from "zod";
import { shortCodeSearchService } from "../services/shortCodeSearchService";
import { redisUrlSearch } from "../services/redisUrlSearch";
import { urlRedisStoreService } from "../services/urlRedisStoreService";

const shortCodeSchema = zod.object({
    shortCode: zod.string()
});

const bodySchema = zod.object({
    password: zod.string()
});

const protectedCheck = ( password: string, storedPassword: string) : Boolean => {

    const bodyResult = bodySchema.safeParse({ password });

    if(!bodyResult.success) return false;
    if(bodyResult.data.password !== storedPassword) return false;

    return true;

}

export const redirectUrl = async (req : Request, res : Response) => {

    const shortCode = req.params.shortCode;
    const { urlPassword } = req.body;
    const result = shortCodeSchema.safeParse({ shortCode });

    if(!result.success){
        return res.status(400).json({ mssg: "Invalid short code" });
    }

    const { shortCode: validatedShortCode } = result.data;

    try{

        try{

            const redisUrl = await redisUrlSearch(validatedShortCode);

            if(redisUrl && redisUrl.isProtected) {

                if(!protectedCheck(urlPassword, redisUrl.passwordHash)){
                    return res.status(401).json({
                        mssg: "Password is not correct/valid"
                    })
                }

            }

            if(redisUrl) {
                return res.status(200).json({
                    mssg: "Original Url is retrieved from redis",
                    originalUrl: redisUrl.originalUrl
                });
            }

        }catch(err) {
            console.log("Error searching Redis: " + err);
        }

        const urlRecord = await shortCodeSearchService(validatedShortCode);

        if (!urlRecord || !urlRecord.originalUrl) {
            return res.status(404).json({ mssg: "URL not found" });
        }

        if(urlRecord.isProtected && urlRecord.passwordHash){
            if(!urlPassword) {
                return res.status(401).json({
                    mssg: "Password required to access link"
                });
            }

            if(!protectedCheck(urlPassword, urlRecord.passwordHash)){
                return res.status(401).json({
                    mssg: "Password is incorrect/invalid"
                })
            }

        }

        try {
            const customAlias = urlRecord.customAlias
            await urlRedisStoreService(urlRecord, customAlias);
        }catch(err) {
            console.log("Error storing data in redis: " + err);
        }

        return res.status(200).json({
            mssg: "Original Url is retrieved from database",
            originalUrl : urlRecord.originalUrl
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}
