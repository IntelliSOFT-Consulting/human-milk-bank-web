/*
  Warnings:

  - The values [HMB] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('ADMINISTRATOR', 'DOCTOR', 'NURSE', 'NEONATAL_NURSES', 'NEONATOLOGIST', 'HMB_ASSISTANT', 'DEPUTY_NURSE_MANAGER', 'NUTRITION_OFFICER', 'PEDIATRICIAN', 'HEAD_OF_DEPARTMENT', 'NURSE_COUNSELLOR', 'NURSING_OFFICER_IN_CHARGE');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
COMMIT;
