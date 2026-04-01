/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ALTER COLUMN "totalSessions" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Membership_clerkId_key" ON "Membership"("clerkId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
