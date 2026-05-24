import { NextFunction, Request, Response } from "express";


export const limiter = (req: Request, res: Response, next: NextFunction) => {

    next();

}