/*
  Warnings:

  - The `availableHours` column on the `technician_schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Hour" AS ENUM ('H07_00', 'H08_00', 'H09_00', 'H10_00', 'H11_00', 'H12_00', 'H13_00', 'H14_00', 'H15_00', 'H16_00', 'H17_00', 'H18_00', 'H19_00', 'H20_00', 'H21_00', 'H22_00', 'H23_00');

-- AlterTable
ALTER TABLE "technician_schedule" DROP COLUMN "availableHours",
ADD COLUMN     "availableHours" "Hour"[];
