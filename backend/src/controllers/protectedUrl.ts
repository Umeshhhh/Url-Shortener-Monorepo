import { Request, Response } from "express";
import { isProtectedRedisCheck } from "../services/isProtectedRedisCheck";
import { isProtectedDatabaseCheck } from "../services/isProtectedDatabaseCheck";
import zod from "zod";

const paramSchema = zod.object({
    shortCode: zod.string()
})

export const protectedUrl = async (req: Request, res: Response) => {

    const { shortCode } = req.params;

    const result = paramSchema.safeParse({ shortCode });
    if(!result.success) {
        return res.status(400).json({ mssg: "Invalid short code" });
    }

    const { shortCode: validShortCode } = result.data;

    try {

        const result = await isProtectedRedisCheck(validShortCode);
        if(result) {
            console.log("Protected URL found in Redis");
            return res.status(200).json({ mssg: "URL is protected"});
        }

        const dbResult = await isProtectedDatabaseCheck(validShortCode);
        if(dbResult) {
            console.log("Protected URL found in Database");
            return res.status(200).json({ mssg: "URL is protected"});
        }

        return res.status(404).json({ mssg: "URL is not protected" });

    }catch(err) {

        console.error("Error occurred while checking protected URL: ", err);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}