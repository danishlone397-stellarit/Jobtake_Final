-- Add exact employer-entered experience range to jobs.
ALTER TABLE "Job" ADD COLUMN "experienceMin" INTEGER;
ALTER TABLE "Job" ADD COLUMN "experienceMax" INTEGER;

CREATE INDEX "Job_experienceMin_experienceMax_idx" ON "Job"("experienceMin", "experienceMax");
