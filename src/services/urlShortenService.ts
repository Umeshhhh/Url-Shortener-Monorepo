import { customAlphabet } from "nanoid";
import prisma from "../prisma/prisma";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

export const urlShortenService = async () => {

    try{
        let shortCode;

        do{
            shortCode = nanoid();
        }while(await prisma.shortUrl.findUnique(({
            where: {
                shortCode
            }
        })))

        return shortCode;
    }catch(err){
        console.log(err);
        throw new Error("Error generating short code");
    }


}