/*
  Warnings:

  - You are about to drop the column `postgresCredentials` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserPostgresDatabase` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[telegramId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserPostgresDatabase" DROP CONSTRAINT "UserPostgresDatabase_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "postgresCredentials",
ADD COLUMN     "telegramId" TEXT;

-- DropTable
DROP TABLE "UserPostgresDatabase";

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
