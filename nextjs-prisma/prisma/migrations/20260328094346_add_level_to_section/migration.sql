-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'Beginner';
