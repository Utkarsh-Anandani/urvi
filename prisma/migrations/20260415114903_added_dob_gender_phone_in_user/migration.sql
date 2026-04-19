-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "phone" TEXT;
