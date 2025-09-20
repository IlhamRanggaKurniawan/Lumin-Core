/*
  Warnings:

  - You are about to drop the column `tokenChainId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_tokenAddress_tokenChainId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "tokenChainId",
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_tokenAddress_chainId_fkey" FOREIGN KEY ("tokenAddress", "chainId") REFERENCES "public"."Token"("address", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;
