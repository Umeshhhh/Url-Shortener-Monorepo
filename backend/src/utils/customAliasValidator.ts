import zod from "zod";
import { redisUrlSearch } from "../services/redisUrlSearch";
import { shortCodeSearchService } from "../services/shortCodeSearchService";

export const customAliasValidator = async (customAlias: string) => {

    const RESERVED_ALIASES = [
        "shorten",
        "isprotected",
        "api",
        "admin",
        "login",
        "register",
        "logout",
        "health",
        "metrics",
        "docs",
        "static",
    ];

    const customAliasSchema = zod
        .string()
        .trim()
        .toLowerCase()
        .min(3, "Custom alias must be at least 3 characters")
        .max(32, "Custom alias must be at most 32 characters")
        .regex(/^[a-z0-9_-]+$/, "Custom alias can only contain letters, numbers, hyphens, and underscores")
        .refine(
            (alias) => !RESERVED_ALIASES.includes(alias),
            "This custom alias is reserved"
        );

    const aliasSchema = zod.object({
        customAlias: customAliasSchema
    });

    const result = aliasSchema.safeParse({customAlias});
    if(!result.success){

        return {
            statusCode: 400,
            isValid: false,
            correctAlias: "",
            mssg: "CustomAlias is not valid",
            error: result.error
        }

    }

    try {

        try {
            const redisResult = await redisUrlSearch(result.data.customAlias);
            if(redisResult) {
                return {
                    statusCode: 409,
                    isValid: false,
                    correctAlias: "",
                    mssg: "CustomAlias already exist",
                    error: ""
                }
            }
        }catch(err) {
            console.log("Redis Error: " + err);
        }

        const dbResult = await shortCodeSearchService(result.data.customAlias, false);
        if(dbResult) {
            return {
            statusCode: 409,
            isValid: false,
            correctAlias: "",
            mssg: "CustomAlias already exist",
            error: ""
        }
        }

        return {
            statusCode: 200,
            isValid: true,
            correctAlias: result.data.customAlias,
            mssg: "CustomAlias is valid",
            error: ""
        }

    }catch(err) {

        console.log(err);
        return {
            statusCode: 500,
            isValid: false,
            correctAlias: "",
            mssg: "Internal Server Error",
            error: err
        }

    }

}
