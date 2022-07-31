/*
  Warnings:

  - You are about to drop the column `dhmVolume` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `dhmVolume` on the `StockEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dhmVolume",
ADD COLUMN     "pasturized" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "unPasturized" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "StockEntry" DROP COLUMN "dhmVolume";
