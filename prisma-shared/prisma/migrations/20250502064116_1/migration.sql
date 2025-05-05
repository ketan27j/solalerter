-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'RUNNING', 'STOPPED', 'ERROR');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('Google', 'Github');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('TOKEN', 'NFT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "googleId" TEXT,
    "name" TEXT,
    "postgresCredentials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "addressType" "AddressType" NOT NULL DEFAULT 'TOKEN',
    "transactionType" TEXT,
    "address" TEXT,
    "webhookId" TEXT,
    "webhookUrl" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'STOPPED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenPrice" (
    "id" SERIAL NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "price" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPostgresDatabase" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "databaseName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPostgresDatabase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenPrice" ADD CONSTRAINT "TokenPrice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPostgresDatabase" ADD CONSTRAINT "UserPostgresDatabase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
