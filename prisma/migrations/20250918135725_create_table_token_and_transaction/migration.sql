-- CreateTable
CREATE TABLE "public"."Token" (
    "address" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("address","chainId")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "hash" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tokenAddress" TEXT,
    "tokenChainId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("hash","chainId")
);

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_tokenAddress_tokenChainId_fkey" FOREIGN KEY ("tokenAddress", "tokenChainId") REFERENCES "public"."Token"("address", "chainId") ON DELETE SET NULL ON UPDATE CASCADE;
