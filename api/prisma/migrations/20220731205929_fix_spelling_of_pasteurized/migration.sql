/*
  Warnings:

  - You are about to drop the column `pasturized` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `unPasturized` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pasturized",
DROP COLUMN "unPasturized",
ADD COLUMN     "pasteurized" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "unPasteurized" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
