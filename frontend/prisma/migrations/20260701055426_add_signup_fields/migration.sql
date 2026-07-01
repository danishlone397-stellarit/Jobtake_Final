-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "contactDesignation" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "registrationAs" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;
