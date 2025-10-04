-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE "VisaType" AS ENUM ('F1_STUDENT', 'H1B_WORK', 'B1B2_TOURIST', 'J1_EXCHANGE', 'L1_TRANSFER');
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "QuestionTopic" AS ENUM ('PERSONAL_INFO', 'STUDY_PLAN', 'FINANCIAL', 'CAREER', 'TIES_TO_HOME', 'PROGRAM_DETAILS', 'IMMIGRATION_INTENT', 'BACKGROUND', 'OTHER');
CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'STUDENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "questions" (
  "id" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "textEn" TEXT,
  "textZh" TEXT,
  "visaType" "VisaType" NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'USA',
  "topic" "QuestionTopic" NOT NULL,
  "difficulty" "Difficulty" NOT NULL,
  "followUps" TEXT[],
  "rubric" JSONB,
  "sampleAnswer" TEXT,
  "tips" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "interviews" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "visaType" "VisaType" NOT NULL,
  "accentType" TEXT NOT NULL DEFAULT 'en-US-Female',
  "totalQuestions" INTEGER NOT NULL DEFAULT 10,
  "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "totalScore" DOUBLE PRECISION,

  CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "interview_questions" (
  "id" TEXT NOT NULL,
  "interviewId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "audioUrl" TEXT,
  "userAnswer" TEXT,
  "audioAnswer" TEXT,
  "transcription" TEXT,
  "score" DOUBLE PRECISION,
  "feedback" JSONB,
  "answeredAt" TIMESTAMP(3),

  CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "reports" (
  "id" TEXT NOT NULL,
  "interviewId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "totalScore" DOUBLE PRECISION NOT NULL,
  "contentScore" DOUBLE PRECISION NOT NULL,
  "languageScore" DOUBLE PRECISION NOT NULL,
  "performanceScore" DOUBLE PRECISION NOT NULL,
  "riskScore" DOUBLE PRECISION NOT NULL,
  "strengths" TEXT[],
  "weaknesses" TEXT[],
  "suggestions" TEXT[],
  "overallFeedback" TEXT NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "averageResponseTime" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "system_configs" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "interview_questions_interviewId_order_key" ON "interview_questions"("interviewId", "order");
CREATE UNIQUE INDEX "reports_interviewId_key" ON "reports"("interviewId");
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reports" ADD CONSTRAINT "reports_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
