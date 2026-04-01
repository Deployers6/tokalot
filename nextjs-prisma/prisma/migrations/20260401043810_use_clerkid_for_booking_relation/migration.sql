/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId,sectionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_clerkId_idx" ON "Booking"("clerkId");

-- CreateIndex
CREATE INDEX "Booking_sectionId_idx" ON "Booking"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_clerkId_sectionId_key" ON "Booking"("clerkId", "sectionId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
