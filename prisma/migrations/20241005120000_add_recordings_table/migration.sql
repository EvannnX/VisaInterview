-- Create recordings table to store per-question audio answers
CREATE TABLE "recordings" (
    "id" TEXT NOT NULL,
    "interviewQuestionId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "durationSeconds" DOUBLE PRECISION,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recordings_pkey" PRIMARY KEY ("id")
);

-- Ensure one recording per interview question
CREATE UNIQUE INDEX "recordings_interviewQuestionId_key" ON "recordings"("interviewQuestionId");

-- Maintain referential integrity with interview questions
ALTER TABLE "recordings"
  ADD CONSTRAINT "recordings_interviewQuestionId_fkey"
  FOREIGN KEY ("interviewQuestionId") REFERENCES "interview_questions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

