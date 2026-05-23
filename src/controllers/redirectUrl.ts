import { Request, Response } from "express";
import zod from "zod";
import { shortCodeSerarchService } from "../services/shortCodeSearchService";

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

        const { originalUrl } = await shortCodeSerarchService(validatedShortCode);

        if (!originalUrl) {
            return res.status(404).json({ mssg: "URL not found" });
        }

        return res.status(200).json({
            mssg: "Original Url is retrieved",
            originalUrl
        }).redirect(originalUrl);

    } catch (e) {
        console.log(e);
        return res.status(500).json({ mssg: "Internal server error" });

    }

}