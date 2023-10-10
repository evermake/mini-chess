/*
  Warnings:

  - You are about to drop the `Games` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_blackId_fkey";

-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_whiteId_fkey";

-- DropTable
DROP TABLE "Games";

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "whiteId" INTEGER,
    "blackId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "fen" TEXT NOT NULL,
    "isPaused" BOOLEAN NOT NULL,
    "timeLimitW" INTEGER NOT NULL,
    "timeLimitB" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_whiteId_fkey" FOREIGN KEY ("whiteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_blackId_fkey" FOREIGN KEY ("blackId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
