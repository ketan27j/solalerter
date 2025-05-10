-- CreateTable
CREATE TABLE "HeliusResponse" (
    "id" SERIAL NOT NULL,
    "response" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeliusResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HeliusResponse" ADD CONSTRAINT "HeliusResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
