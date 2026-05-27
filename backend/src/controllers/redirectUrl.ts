import { Request, Response } from "express";
import zod from "zod";
import { shortCodeSerarchService } from "../services/shortCodeSearchService";
import { redisUrlSearch } from "../services/redisUrlSearch";
import { urlRedisStoreService } from "../services/urlRedisStoreService";

const shortCodeSchema = zod.object({
    shortCode: zod.string()
});

export const redirectUrl = async (req : Request, res : Response) => {

    const shortCode = req.params.shortCode;
    const result = shortCodeSchema.safeParse({ shortCode });

    if(!result.success){
        return res.status(400).json({ mssg: "Invalid short code" });
    }

    const { shortCode: validatedShortCode } = result.data;

    try{

        try{

            const redisUrl = await redisUrlSearch(validatedShortCode);

            if(redisUrl) {
                return res.status(200).json({
                    mssg: "Original Url is retrieved from redis",
                    originalUrl: redisUrl
                });
            }

        }catch(err) {
            console.log(err);
        }

        const urlRecord = await shortCodeSerarchService(validatedShortCode);

        if (!urlRecord || !urlRecord.originalUrl) {
            return res.status(404).json({ mssg: "URL not found" });
        }

        const { originalUrl } = urlRecord;

        await urlRedisStoreService(validatedShortCode, originalUrl);

        return res.status(200).json({
            mssg: "Original Url is retrieved from database",
            originalUrl
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}