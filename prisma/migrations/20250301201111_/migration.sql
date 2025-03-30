/*
  Warnings:

  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `ispublished` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Note` table. All the data in the column will be lost.
  - The `id` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `thumbnailUrl` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Note" DROP CONSTRAINT "Note_pkey",
DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "ispublished",
DROP COLUMN "price",
DROP COLUMN "updatedAt",
ADD COLUMN     "decsription" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Note_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "imageUrl" TEXT,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
