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

        const redisResult = await isProtectedRedisCheck(validShortCode);
        if(redisResult) {
            if(!redisResult.isActive){
                return res.status(410).json({
                    isActive: false,
                    isProtected: redisResult.isProtected,
                    mssg: "Url is Inactive"
                });
            }else if(redisResult.isProtected){
                return res.status(200).json({
                    isActive: true,
                    isProtected: true,
                    mssg: "URL is protected"
                });
            }
            return res.status(200).json({
                isActive: true,
                isProtected: false,
                mssg: "URL is not protected"
            })
        }

        const dbResult = await isProtectedDatabaseCheck(validShortCode);
        if(dbResult) {
            if(!dbResult.isActive){
                return res.status(410).json({
                    isActive: false,
                    isProtected: dbResult.isProtected,
                    mssg: "Url is Inactive"
                });
            }else if(dbResult.isProtected){
                return res.status(200).json({
                    isActive: true,
                    isProtected: true,
                    mssg: "URL is protected"
                });
            }
            
            return res.status(200).json({
                isActive: true,
                isProtected: false,
                mssg: "URL is not protected"
            });
        }

        return res.status(404).json({
            isActive: false,
            isProtected: false,
            mssg: "URL not found"
        });

    }catch(err) {

        console.error("Error occurred while checking protected URL: ", err);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}
