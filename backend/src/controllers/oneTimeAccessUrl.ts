import { Request, Response } from "express";
import zod from "zod";
import axios from "axios";
import { env } from "../config/env";

const parseSchema = zod.object({
    shortCode: zod.string()
});

export const oneTimeAccessUrl = async (req: Request, res: Response) => {

    try{

        const data = await axios(`http://localhost:${env.port}/shorten`, {
            data: req.body
        });

        const result = parseSchema.safeParse(data.data.shortCode);
        if(!result.success){
            return res.status(400).json({ mssg: "Invalid shortCode format!!" })
        }

        //db call to store the shortCode and the associated URL with a one-time access flag

        

    }catch(err) {
        console.error("Error in oneTimeAccessUrl controller:", err);
        return res.status(500).json({ mssg: "Internal server error" });
    }

    

    return res.status(200).json({
        mssg: "One time access url route is working"
    });

}