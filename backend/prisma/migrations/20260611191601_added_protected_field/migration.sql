-- AlterTable
ALTER TABLE "ShortUrl" ADD COLUMN     "isProtected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
