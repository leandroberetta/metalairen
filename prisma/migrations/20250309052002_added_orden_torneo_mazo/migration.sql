/*
  Warnings:

  - You are about to drop the column `formato` on the `mazos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mazos" DROP COLUMN "formato";

-- AlterTable
ALTER TABLE "torneos_mazos" ADD COLUMN     "orden" INTEGER;
