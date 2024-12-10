-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "userBio" TEXT,
ADD COLUMN     "userInterest" TEXT[],
ADD COLUMN     "userSkills" TEXT[];
