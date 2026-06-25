/*
  Warnings:

  - You are about to drop the column `clicks` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `ShortUrl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customAlias]` on the table `ShortUrl` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ShortUrl" DROP COLUMN "clicks",
DROP COLUMN "password",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "customAlias" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxClicks" INTEGER,
ADD COLUMN     "oneTimeAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "startsAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_customAlias_key" ON "ShortUrl"("customAlias");
