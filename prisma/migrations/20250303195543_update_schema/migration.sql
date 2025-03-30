/*
  Warnings:

  - You are about to drop the column `decsription` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Note` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "decsription",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
