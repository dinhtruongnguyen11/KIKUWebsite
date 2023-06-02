/*
  Warnings:

  - Added the required column `type` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "type" TEXT NOT NULL;
