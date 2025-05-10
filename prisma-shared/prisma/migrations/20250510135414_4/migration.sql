/*
  Warnings:

  - You are about to drop the column `Address` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "Address",
DROP COLUMN "Name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "name" TEXT;
