-- CreateEnum
CREATE TYPE "DhmType" AS ENUM ('Term', 'Preterm');

-- CreateEnum
CREATE TYPE "DispensingStatus" AS ENUM ('Pending', 'Dispensed');

-- CreateTable
CREATE TABLE "StockEntry" (
    "id" TEXT NOT NULL,
    "dhmType" "DhmType" NOT NULL,
    "unPasteurized" DOUBLE PRECISION NOT NULL,
    "pasteurized" DOUBLE PRECISION NOT NULL,
    "dhmVolume" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StockEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "dhmType" "DhmType" NOT NULL,
    "userId" TEXT NOT NULL,
    "dhmVolume" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" "DispensingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockEntry" ADD CONSTRAINT "StockEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
