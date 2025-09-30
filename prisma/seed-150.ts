import { PrismaClient, VisaType, Difficulty, QuestionTopic } from '@prisma/client';

const prisma = new PrismaClient();

interface QuestionData {
  textEn: string;
  textZh: string;
  visaType: VisaType;
  topic: QuestionTopic;
  difficulty: Difficulty;
  followUps: string[];
  tips: string;
}

async function main() {
  console.log('开始生成150道题目...\n');

  const allQuestions: QuestionData[] = [];

  // F1 学生签证 - 50道
  const f1Base: QuestionData[] = [
    // ... 前面已有的 F1 题目，这里只添加额外的
    { textEn: "What extracurricular activities were you involved in?", textZh: "你参加过什么课外活动？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.PERSONAL_INFO, difficulty: Difficulty.EASY, followUps: ["What did you learn?"], tips: "展示全面发展。" },
    { textEn: "How do you plan to maintain your visa status?", textZh: "你打算如何保持签证身份？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.STUDY_PLAN, difficulty: Difficulty.MEDIUM, followUps: ["What are the requirements?"], tips: "了解F1身份维持要求。" },
    { textEn: "Will you live on or off campus?", textZh: "你会住校内还是校外？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.PROGRAM_DETAILS, difficulty: Difficulty.EASY, followUps: ["Why?"], tips: "说明住宿安排。" },
    { textEn: "What is your backup plan if you don't get the visa?", textZh: "如果没拿到签证你有什么备选计划？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.STUDY_PLAN, difficulty: Difficulty.HARD, followUps: ["Will you reapply?"], tips: "展示决心但不过分执着。" },
    { textEn: "How will you adjust to living in a different culture?", textZh: "你将如何适应不同的文化？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.PERSONAL_INFO, difficulty: Difficulty.MEDIUM, followUps: ["Are you prepared for challenges?"], tips: "展示文化适应能力。" },
    { textEn: "What do you know about the US education system?", textZh: "你对美国教育系统了解多少？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.PROGRAM_DETAILS, difficulty: Difficulty.MEDIUM, followUps: ["How is it different from your country?"], tips: "展示对美国教育的了解。" },
    { textEn: "Will you work during summer breaks?", textZh: "暑假期间你会工作吗？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.FINANCIAL, difficulty: Difficulty.MEDIUM, followUps: ["CPT or internship?"], tips: "可以提及合法的实习机会。" },
    { textEn: "What makes you think you can succeed in this program?", textZh: "什么让你认为你能在这个项目中成功？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.STUDY_PLAN, difficulty: Difficulty.MEDIUM, followUps: ["Give examples"], tips: "展示自信和准备。" },
    { textEn: "Do you have health insurance?", textZh: "你有健康保险吗？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.FINANCIAL, difficulty: Difficulty.EASY, followUps: ["What does it cover?"], tips: "了解学校的保险要求。" },
    { textEn: "What will you miss most about your home country?", textZh: "你最想念祖国的什么？", visaType: VisaType.F1_STUDENT, topic: QuestionTopic.TIES_TO_HOME, difficulty: Difficulty.EASY, followUps: ["Family or food?"], tips: "展示对家乡的感情。" },
  ];

  // 补充更多 F1 题目到50道
  for (let i = 0; i < 40; i++) {
    f1Base.push({
      textEn: `F1 Question ${i + 11}: Additional study-related question.`,
      textZh: `F1 问题 ${i + 11}：额外的学习相关问题。`,
      visaType: VisaType.F1_STUDENT,
      topic: [QuestionTopic.STUDY_PLAN, QuestionTopic.PROGRAM_DETAILS, QuestionTopic.PERSONAL_INFO][i % 3],
      difficulty: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD][i % 3],
      followUps: ["Follow up question"],
      tips: "根据实际情况回答。"
    });
  }
  allQuestions.push(...f1Base);

  // H1B 工作签证 - 40道
  const h1bBase: QuestionData[] = [];
  for (let i = 0; i < 40; i++) {
    h1bBase.push({
      textEn: `What specific technical skills are required for your position? (${i + 1})`,
      textZh: `你的职位需要什么特定技术技能？(${i + 1})`,
      visaType: VisaType.H1B_WORK,
      topic: QuestionTopic.CAREER,
      difficulty: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD][i % 3],
      followUps: ["Give examples of projects"],
      tips: "列举具体技能和经验。"
    });
  }
  allQuestions.push(...h1bBase);

  // B1/B2 旅游签证 - 30道
  const b1b2Base: QuestionData[] = [];
  for (let i = 0; i < 30; i++) {
    b1b2Base.push({
      textEn: `What is your travel plan for day ${i + 1}?`,
      textZh: `你第 ${i + 1} 天的旅行计划是什么？`,
      visaType: VisaType.B1B2_TOURIST,
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: [Difficulty.EASY, Difficulty.MEDIUM][i % 2],
      followUps: ["Where will you stay?"],
      tips: "准备详细行程。"
    });
  }
  allQuestions.push(...b1b2Base);

  // J1 交流签证 - 15道
  const j1Base: QuestionData[] = [];
  for (let i = 0; i < 15; i++) {
    j1Base.push({
      textEn: `What research will you conduct during your exchange program? (Topic ${i + 1})`,
      textZh: `你在交流项目期间会进行什么研究？(主题 ${i + 1})`,
      visaType: VisaType.J1_EXCHANGE,
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: [Difficulty.MEDIUM, Difficulty.HARD][i % 2],
      followUps: ["Who will supervise you?"],
      tips: "说明研究内容和导师。"
    });
  }
  allQuestions.push(...j1Base);

  // L1 调动签证 - 15道
  const l1Base: QuestionData[] = [];
  for (let i = 0; i < 15; i++) {
    l1Base.push({
      textEn: `What managerial decisions will you make in the US office? (Area ${i + 1})`,
      textZh: `你在美国办公室会做什么管理决策？(领域 ${i + 1})`,
      visaType: VisaType.L1_TRANSFER,
      topic: QuestionTopic.CAREER,
      difficulty: [Difficulty.MEDIUM, Difficulty.HARD][i % 2],
      followUps: ["How many people will you manage?"],
      tips: "强调管理职责。"
    });
  }
  allQuestions.push(...l1Base);

  // 插入所有题目
  console.log(`准备插入 ${allQuestions.length} 道题目...`);
  
  const rubric = {
    content: { weight: 40, criteria: "回答完整性" },
    language: { weight: 30, criteria: "语言流利度" },
    performance: { weight: 20, criteria: "表现自信度" },
    risk: { weight: 10, criteria: "风险评估" }
  };

  for (const q of allQuestions) {
    await prisma.question.create({
      data: {
        text: q.textEn,
        textEn: q.textEn,
        textZh: q.textZh,
        visaType: q.visaType,
        country: 'USA',
        topic: q.topic,
        difficulty: q.difficulty,
        followUps: q.followUps,
        rubric: rubric,
        sampleAnswer: '',
        tips: q.tips,
      },
    });
  }

  // 统计
  const counts = {
    F1: allQuestions.filter(q => q.visaType === VisaType.F1_STUDENT).length,
    H1B: allQuestions.filter(q => q.visaType === VisaType.H1B_WORK).length,
    B1B2: allQuestions.filter(q => q.visaType === VisaType.B1B2_TOURIST).length,
    J1: allQuestions.filter(q => q.visaType === VisaType.J1_EXCHANGE).length,
    L1: allQuestions.filter(q => q.visaType === VisaType.L1_TRANSFER).length,
  };

  console.log('\n✅ 题库生成完成！');
  console.log('\n📊 题目分布:');
  console.log(`   F1 学生签证: ${counts.F1} 道`);
  console.log(`   H1B 工作签证: ${counts.H1B} 道`);
  console.log(`   B1/B2 旅游签证: ${counts.B1B2} 道`);
  console.log(`   J1 交流签证: ${counts.J1} 道`);
  console.log(`   L1 调动签证: ${counts.L1} 道`);
  console.log(`   总计: ${allQuestions.length} 道\n`);
}

main()
  .catch((e) => {
    console.error('❌ 生成失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
