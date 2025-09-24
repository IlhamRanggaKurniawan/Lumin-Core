/*
  Warnings:

  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "public"."User" (
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "public"."TokenBalance" (
    "userAddress" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TokenBalance_pkey" PRIMARY KEY ("userAddress","tokenAddress","chainId")
);

-- AddForeignKey
ALTER TABLE "public"."TokenBalance" ADD CONSTRAINT "TokenBalance_tokenAddress_chainId_fkey" FOREIGN KEY ("tokenAddress", "chainId") REFERENCES "public"."Token"("address", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TokenBalance" ADD CONSTRAINT "TokenBalance_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "public"."User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
