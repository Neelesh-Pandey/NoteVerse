/*
  Warnings:

  - Added the required column `pdfUrl` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageUrl` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "pdfUrl" TEXT NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;
