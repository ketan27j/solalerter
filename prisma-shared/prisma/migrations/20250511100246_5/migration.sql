-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "tweet_id" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "screen_name" TEXT NOT NULL,
    "bookmarks" INTEGER NOT NULL,
    "favorites" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "quotes" INTEGER NOT NULL,
    "replies" INTEGER NOT NULL,
    "retweets" INTEGER NOT NULL,
    "keyword" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    "isAnalyzed" BOOLEAN NOT NULL DEFAULT false,
    "isPresale" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" INTEGER,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweet_id_key" ON "Tweet"("tweet_id");

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
