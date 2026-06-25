/*
  Warnings:

  - You are about to drop the column `shortUrl` on the `ShortUrl` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ShortUrl_shortUrl_key";

-- AlterTable
ALTER TABLE "ShortUrl" DROP COLUMN "shortUrl";
