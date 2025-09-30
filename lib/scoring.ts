// 评分系统

export interface ScoringRubric {
  content: { weight: number; criteria: string };
  language: { weight: number; criteria: string };
  performance: { weight: number; criteria: string };
  risk: { weight: number; criteria: string };
}

export interface AnswerEvaluation {
  contentScore: number; // 0-100
  languageScore: number; // 0-100
  performanceScore: number; // 0-100
  riskScore: number; // 0-100
  totalScore: number; // 加权总分
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    detailedFeedback: string;
  };
}

/**
 * 使用 AI 评估答案
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  rubric: ScoringRubric,
  sampleAnswer?: string
): Promise<AnswerEvaluation> {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        answer,
        rubric,
        sampleAnswer,
      }),
    });

    if (!response.ok) {
      throw new Error('评分请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('评分失败:', error);
    // 返回默认评分
    return getDefaultEvaluation();
  }
}

/**
 * 计算面试总体报告
 */
export function calculateInterviewReport(
  evaluations: AnswerEvaluation[]
): {
  totalScore: number;
  contentScore: number;
  languageScore: number;
  performanceScore: number;
  riskScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallFeedback: string;
} {
  const count = evaluations.length;

  const totalScore =
    evaluations.reduce((sum, e) => sum + e.totalScore, 0) / count;
  const contentScore =
    evaluations.reduce((sum, e) => sum + e.contentScore, 0) / count;
  const languageScore =
    evaluations.reduce((sum, e) => sum + e.languageScore, 0) / count;
  const performanceScore =
    evaluations.reduce((sum, e) => sum + e.performanceScore, 0) / count;
  const riskScore =
    evaluations.reduce((sum, e) => sum + e.riskScore, 0) / count;

  // 汇总所有优点、缺点和建议
  const allStrengths = evaluations.flatMap((e) => e.feedback.strengths);
  const allWeaknesses = evaluations.flatMap((e) => e.feedback.weaknesses);
  const allSuggestions = evaluations.flatMap((e) => e.feedback.suggestions);

  // 去重
  const strengths = [...new Set(allStrengths)];
  const weaknesses = [...new Set(allWeaknesses)];
  const suggestions = [...new Set(allSuggestions)];

  // 生成总体反馈
  let overallFeedback = '';
  if (totalScore >= 80) {
    overallFeedback = '表现优秀！您的回答展现了充分的准备和良好的沟通能力。继续保持！';
  } else if (totalScore >= 60) {
    overallFeedback = '表现良好，但仍有提升空间。注意加强薄弱环节，多加练习。';
  } else {
    overallFeedback =
      '需要更多准备。建议针对评分较低的维度重点练习，并寻求专业指导。';
  }

  return {
    totalScore,
    contentScore,
    languageScore,
    performanceScore,
    riskScore,
    strengths: strengths.slice(0, 5), // 最多5条
    weaknesses: weaknesses.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
    overallFeedback,
  };
}

/**
 * 默认评分（当 AI 评分失败时使用）
 */
function getDefaultEvaluation(): AnswerEvaluation {
  return {
    contentScore: 70,
    languageScore: 70,
    performanceScore: 70,
    riskScore: 70,
    totalScore: 70,
    feedback: {
      strengths: ['完成了回答'],
      weaknesses: ['无法自动评分，请人工审核'],
      suggestions: ['继续练习'],
      detailedFeedback: '由于技术原因，无法完成自动评分。',
    },
  };
}

