import { PrismaClient, VisaType, Difficulty, QuestionTopic } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据填充...');

  // 创建管理员账户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '系统管理员',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ 创建管理员账户:', admin.email);

  // 创建学员账户
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: '测试学员',
      password: studentPassword,
      role: 'STUDENT',
    },
  });
  console.log('✓ 创建学员账户:', student.email);

  // 创建示例题目 - F1学生签证
  const f1Questions = [
    {
      textEn: "What is your intended major and why did you choose it?",
      textZh: "你的专业是什么？为什么选择这个专业？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.EASY,
      followUps: [
        "What specific courses are you most interested in?",
        "How does this major align with your career goals?"
      ],
      rubric: {
        content: { weight: 40, criteria: "回答是否清晰说明专业和选择原因" },
        language: { weight: 30, criteria: "语法、词汇使用是否准确" },
        performance: { weight: 20, criteria: "表达是否自信、逻辑清晰" },
        risk: { weight: 10, criteria: "是否提及移民倾向或矛盾信息" }
      },
      sampleAnswer: "I plan to major in Computer Science because I have always been passionate about technology and problem-solving. During my undergraduate studies, I took several programming courses and realized that this is the field where I can make the most impact.",
      tips: "清晰说明专业名称，结合个人兴趣和背景，避免过于笼统。"
    },
    {
      textEn: "Why did you choose this particular university?",
      textZh: "你为什么选择这所大学？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "Did you apply to other universities?",
        "What specific programs or professors attracted you?"
      ],
      rubric: {
        content: { weight: 40, criteria: "是否有具体的理由，而非泛泛而谈" },
        language: { weight: 30, criteria: "词汇丰富度和流利度" },
        performance: { weight: 20, criteria: "热情度和准备充分程度" },
        risk: { weight: 10, criteria: "是否暗示只为留美而选学校" }
      },
      sampleAnswer: "I chose Stanford University because of its outstanding Computer Science department, particularly its research in artificial intelligence. The faculty members like Professor Andrew Ng have made significant contributions to the field, and I hope to learn from them.",
      tips: "提及具体的教授、项目、研究方向或学校特色，显示你做了功课。"
    },
    {
      textEn: "How will you finance your education in the United States?",
      textZh: "你如何支付在美国的学费和生活费？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "Do you have any scholarships?",
        "What do your parents do for a living?"
      ],
      rubric: {
        content: { weight: 40, criteria: "是否清楚说明资金来源和充足性" },
        language: { weight: 30, criteria: "表达准确性" },
        performance: { weight: 20, criteria: "自信度，无闪烁其词" },
        risk: { weight: 10, criteria: "是否有打工、贷款等高风险信号" }
      },
      sampleAnswer: "My parents will support my education. My father is a business owner and my mother is a doctor. They have saved enough money to cover my tuition and living expenses. I also received a partial scholarship from the university.",
      tips: "明确说明资金来源（父母、奖学金、存款），不要提及打工或贷款。"
    },
    {
      textEn: "What do you plan to do after graduation?",
      textZh: "毕业后你有什么计划？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Why not stay in the United States?",
        "What opportunities are there for you in your home country?"
      ],
      rubric: {
        content: { weight: 40, criteria: "是否明确表达回国意愿和计划" },
        language: { weight: 30, criteria: "回答流畅度" },
        performance: { weight: 20, criteria: "坚定程度和说服力" },
        risk: { weight: 10, criteria: "是否有留美倾向" }
      },
      sampleAnswer: "After graduation, I plan to return to China and work in the technology industry. China has a booming tech sector with companies like Alibaba and Tencent, and I believe the skills I learn in the US will be highly valuable there. My family and future are in China.",
      tips: "强调回国计划，提及国内的机会和家庭联系。"
    },
    {
      textEn: "Tell me about yourself.",
      textZh: "介绍一下你自己。",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: [
        "What are your hobbies?",
        "What is your greatest achievement?"
      ],
      rubric: {
        content: { weight: 40, criteria: "是否涵盖教育背景、兴趣、目标" },
        language: { weight: 30, criteria: "语言流畅度" },
        performance: { weight: 20, criteria: "自信和亲和力" },
        risk: { weight: 10, criteria: "是否提及敏感信息" }
      },
      sampleAnswer: "My name is Li Ming, and I am 22 years old. I recently graduated from Beijing University with a degree in Engineering. I enjoy reading, playing basketball, and learning about new technologies. I am excited about pursuing a Master's degree in the United States.",
      tips: "简洁介绍背景，保持积极正面，避免过长。"
    },
    {
      textEn: "Have you been to the United States before?",
      textZh: "你以前去过美国吗？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: [
        "Where did you go?",
        "Did you return on time?"
      ],
      rubric: {
        content: { weight: 40, criteria: "诚实回答，如去过则说明目的" },
        language: { weight: 30, criteria: "简洁明了" },
        performance: { weight: 20, criteria: "自然流畅" },
        risk: { weight: 10, criteria: "是否有逾期或违规记录" }
      },
      sampleAnswer: "No, I have never been to the United States. This will be my first time traveling there.",
      tips: "如实回答，如果去过，说明是旅游或参加会议，并按时返回。"
    },
    {
      textEn: "Do you have any relatives in the United States?",
      textZh: "你在美国有亲戚吗？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "What do they do there?",
        "Will you stay with them?"
      ],
      rubric: {
        content: { weight: 40, criteria: "诚实回答" },
        language: { weight: 30, criteria: "清晰度" },
        performance: { weight: 20, criteria: "坦然态度" },
        risk: { weight: 10, criteria: "亲戚是否有移民倾向影响" }
      },
      sampleAnswer: "No, I don't have any relatives in the United States. All my family members are in China.",
      tips: "如实回答，有亲戚不一定是坏事，但要说明自己独立生活。"
    },
    {
      textEn: "Why do you want to study in the United States instead of your home country?",
      textZh: "为什么要去美国读书而不是在国内？",
      visaType: VisaType.F1_STUDENT,
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.HARD,
      followUps: [
        "What advantages does the US offer?",
        "Are there no good universities in China?"
      ],
      rubric: {
        content: { weight: 40, criteria: "是否有令人信服的理由" },
        language: { weight: 30, criteria: "论证逻辑性" },
        performance: { weight: 20, criteria: "热情和坚定" },
        risk: { weight: 10, criteria: "是否贬低本国教育" }
      },
      sampleAnswer: "The United States has world-leading programs in my field, with cutting-edge research and excellent faculty. While China has great universities, studying in the US will give me international exposure and access to the latest developments in technology.",
      tips: "强调美国在特定领域的优势，而非贬低国内教育。"
    },
  ];

  for (const q of f1Questions) {
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
        rubric: q.rubric,
        sampleAnswer: q.sampleAnswer,
        tips: q.tips,
      },
    });
  }
  console.log(`✓ 创建 ${f1Questions.length} 道 F1 签证题目`);

  // 创建示例题目 - H1B工作签证
  const h1bQuestions = [
    {
      textEn: "What is your job title and what will you be doing?",
      textZh: "你的职位是什么？你将做什么工作？",
      visaType: VisaType.H1B_WORK,
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: [
        "What are your specific responsibilities?",
        "What technologies will you be working with?"
      ],
      rubric: {
        content: { weight: 40, criteria: "清楚说明职位和职责" },
        language: { weight: 30, criteria: "专业术语使用准确" },
        performance: { weight: 20, criteria: "自信专业" },
        risk: { weight: 10, criteria: "职位描述与申请材料一致" }
      },
      sampleAnswer: "I will be working as a Software Engineer at Google. My responsibilities include developing cloud-based applications, writing efficient code, and collaborating with cross-functional teams.",
      tips: "明确职位名称和主要职责，与 LCA 文件保持一致。"
    },
    {
      textEn: "Why does the company need to hire you instead of an American worker?",
      textZh: "公司为什么要雇用你而不是美国本地员工？",
      visaType: VisaType.H1B_WORK,
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: [
        "What special skills do you have?",
        "Did the company try to find local candidates?"
      ],
      rubric: {
        content: { weight: 40, criteria: "强调独特技能和专业背景" },
        language: { weight: 30, criteria: "说服力" },
        performance: { weight: 20, criteria: "自信但不傲慢" },
        risk: { weight: 10, criteria: "不要贬低美国工人" }
      },
      sampleAnswer: "I have specialized skills in machine learning and AI that are directly relevant to the company's projects. I also have experience working on large-scale systems. The company conducted a thorough recruitment process and determined that my background is the best fit.",
      tips: "强调特殊技能、教育背景和经验，避免贬低本地劳动力。"
    },
    {
      textEn: "What is your educational background?",
      textZh: "你的教育背景是什么？",
      visaType: VisaType.H1B_WORK,
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: [
        "What was your major?",
        "Did you study in the US?"
      ],
      rubric: {
        content: { weight: 40, criteria: "清晰说明学历和专业" },
        language: { weight: 30, criteria: "准确性" },
        performance: { weight: 20, criteria: "流畅度" },
        risk: { weight: 10, criteria: "学历真实性" }
      },
      sampleAnswer: "I have a Master's degree in Computer Science from Stanford University. Before that, I completed my Bachelor's degree in Software Engineering in China.",
      tips: "按时间顺序说明学历，与申请材料一致。"
    },
  ];

  for (const q of h1bQuestions) {
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
        rubric: q.rubric,
        sampleAnswer: q.sampleAnswer,
        tips: q.tips,
      },
    });
  }
  console.log(`✓ 创建 ${h1bQuestions.length} 道 H1B 签证题目`);

  console.log('✅ 种子数据填充完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

