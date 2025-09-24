/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `tokenAddress` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."TokenBalance" DROP CONSTRAINT "TokenBalance_tokenAddress_chainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_tokenAddress_chainId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "tokenAddress" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Token";

-- CreateTable
CREATE TABLE "public"."TokenMetadata" (
    "address" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "TokenMetadata_pkey" PRIMARY KEY ("address","chainId")
);

-- AddForeignKey
ALTER TABLE "public"."TokenBalance" ADD CONSTRAINT "TokenBalance_tokenAddress_chainId_fkey" FOREIGN KEY ("tokenAddress", "chainId") REFERENCES "public"."TokenMetadata"("address", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_tokenAddress_chainId_fkey" FOREIGN KEY ("tokenAddress", "chainId") REFERENCES "public"."TokenMetadata"("address", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;
