/*
  Warnings:

  - You are about to alter the column `timeLimitW` on the `Games` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `timeLimitB` on the `Games` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_blackId_fkey";

-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_whiteId_fkey";

-- AlterTable
ALTER TABLE "Games" ALTER COLUMN "whiteId" DROP NOT NULL,
ALTER COLUMN "blackId" DROP NOT NULL,
ALTER COLUMN "timeLimitW" SET DATA TYPE INTEGER,
ALTER COLUMN "timeLimitB" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_whiteId_fkey" FOREIGN KEY ("whiteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_blackId_fkey" FOREIGN KEY ("blackId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
