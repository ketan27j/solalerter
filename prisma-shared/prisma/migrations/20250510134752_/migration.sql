/*
  Warnings:

  - You are about to drop the column `address` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `subscriptionId` to the `HeliusResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HeliusResponse" ADD COLUMN     "subscriptionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "address",
ADD COLUMN     "Address" TEXT,
ADD COLUMN     "Name" TEXT,
ADD COLUMN     "twitterAlert" BOOLEAN;

-- AddForeignKey
ALTER TABLE "HeliusResponse" ADD CONSTRAINT "HeliusResponse_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
