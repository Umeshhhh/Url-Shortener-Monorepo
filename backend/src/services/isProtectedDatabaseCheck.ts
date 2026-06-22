import prisma from "../prisma/prisma";

export const isProtectedDatabaseCheck = async (shortCode: string) : Promise<Boolean> => {

    try {

        const data = await prisma.shortUrl.findUnique({
            where: {
                shortCode
            }
        });

        if(data) {
            if(data.isProtected) {
                return true;
            }
            return false;
        }

        const customAlias = await prisma.shortUrl.findUnique({
            where: {
                customAlias: shortCode
            }
        });

        if(customAlias && customAlias.isProtected) return true;

        return false;

    }catch(err) {

        console.error("Error occurred while checking protected URL in database: ", err);
        throw err;

    }

}
