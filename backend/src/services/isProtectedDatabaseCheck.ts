import prisma from "../prisma/prisma";

export const isProtectedDatabaseCheck = async (shortCode: string) : Promise<Object | null> => {

    try {

        const data = await prisma.shortUrl.findUnique({
            where: {
                shortCode
            }
        });

        if(data && data.isProtected) {

            return {
                originalUrl: data.originalUrl,
                shortCode: data.shortCode,
                createdAt: data.createdAt,
                clicks: data.clicks,
                isProtected: data.isProtected,
                password: data.password
            };
        }

        return null;

    }catch(err) {

        console.error("Error occurred while checking protected URL in database: ", err);
        throw err;

    }

}