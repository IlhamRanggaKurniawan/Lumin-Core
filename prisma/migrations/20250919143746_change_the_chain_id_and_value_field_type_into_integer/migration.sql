/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `tokenChainId` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `chainId` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `chainId` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `value` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_tokenAddress_tokenChainId_fkey";

-- AlterTable
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_pkey",
DROP COLUMN "chainId",
ADD COLUMN     "chainId" INTEGER NOT NULL,
ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("address", "chainId");

-- AlterTable
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "chainId",
ADD COLUMN     "chainId" INTEGER NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" INTEGER NOT NULL,
DROP COLUMN "tokenChainId",
ADD COLUMN     "tokenChainId" INTEGER,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("hash", "chainId");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_tokenAddress_tokenChainId_fkey" FOREIGN KEY ("tokenAddress", "tokenChainId") REFERENCES "public"."Token"("address", "chainId") ON DELETE SET NULL ON UPDATE CASCADE;
