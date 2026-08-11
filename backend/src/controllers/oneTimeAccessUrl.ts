import { Request, Response } from "express";

export const oneTimeAccessUrl = async (req: Request, res: Response) => {

    return res.status(200).json({
        mssg: "One time access url route is working"
    });

}