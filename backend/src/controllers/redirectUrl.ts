import { Request, Response } from "express";
import zod from "zod";
import { shortCodeSearchService } from "../services/shortCodeSearchService";
import { redisUrlSearch } from "../services/redisUrlSearch";
import { urlRedisStoreService } from "../services/urlRedisStoreService";
import bcrypt from "bcrypt";

const shortCodeSchema = zod.object({
    shortCode: zod.string()
});

const bodySchema = zod.object({
    password: zod.string()
});

const protectedCheck = async (password: string, storedPassword: string) : Promise<boolean> => {

    const bodyResult = bodySchema.safeParse({ password });

    if(!bodyResult.success) return false;

    const isMatch = await bcrypt.compare(bodyResult.data.password, storedPassword);
    if(isMatch) return true;

    return false;

}

const findUrlRecord = async (shortCode: string) => {
    const redisUrl = await redisUrlSearch(shortCode);

    if(redisUrl) {
        return {
            record: redisUrl,
            source: "redis"
        };
    }

    const urlRecord = await shortCodeSearchService(shortCode);
    if(urlRecord) {
        await urlRedisStoreService(urlRecord, urlRecord.customAlias);
    }

    return {
        record: urlRecord,
        source: "database"
    };
};

export const redirectUrl = async (req : Request, res : Response) => {

    const shortCode = req.params.shortCode;
    const result = shortCodeSchema.safeParse({ shortCode });

    if(!result.success){
        return res.status(400).json({ mssg: "Invalid short code" });
    }

    const { shortCode: validatedShortCode } = result.data;

    try{
        const { record: urlRecord } = await findUrlRecord(validatedShortCode);

        if (!urlRecord || !urlRecord.originalUrl) {
            return res.status(404).json({ mssg: "URL not found" });
        }

        if(urlRecord.isProtected) {
            return res.status(401).json({
                mssg: "Password required to access link"
            });
        }

        return res.redirect(302, urlRecord.originalUrl);

    } catch (e) {
        console.log(e);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}

export const resolveUrl = async (req : Request, res : Response) => {

    const shortCode = req.params.shortCode;
    const result = shortCodeSchema.safeParse({ shortCode });

    if(!result.success){
        return res.status(400).json({ mssg: "Invalid short code" });
    }

    const { shortCode: validatedShortCode } = result.data;

    try{
        const { record: urlRecord, source } = await findUrlRecord(validatedShortCode);

        if (!urlRecord || !urlRecord.originalUrl) {
            return res.status(404).json({ mssg: "URL not found" });
        }

        if(urlRecord.isProtected) {
            return res.status(401).json({
                isProtected: true,
                mssg: "Password required to access link"
            });
        }

        return res.status(200).json({
            mssg: `Original Url is retrieved from ${source}`,
            originalUrl : urlRecord.originalUrl
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}

export const accessProtectedUrl = async (req : Request, res : Response) => {

    const shortCode = req.params.shortCode;
    const { urlPassword } = req.body;
    const result = shortCodeSchema.safeParse({ shortCode });

    if(!result.success){
        return res.status(400).json({ mssg: "Invalid short code" });
    }

    const { shortCode: validatedShortCode } = result.data;

    try{
        const { record: urlRecord, source } = await findUrlRecord(validatedShortCode);

        if (!urlRecord || !urlRecord.originalUrl) {
            return res.status(404).json({ mssg: "URL not found" });
        }

        if(!urlRecord.isProtected || !urlRecord.passwordHash) {
            return res.status(200).json({
                mssg: `Original Url is retrieved from ${source}`,
                originalUrl : urlRecord.originalUrl
            });
        }

        if(!urlPassword) {
            return res.status(401).json({
                mssg: "Password required to access link"
            });
        }

        if(!(await protectedCheck(urlPassword, urlRecord.passwordHash))){
            return res.status(401).json({
                mssg: "Invalid Credentials"
            });
        }

        return res.status(200).json({
            mssg: `Original Url is retrieved from ${source}`,
            originalUrl : urlRecord.originalUrl
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}
