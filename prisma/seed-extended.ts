import { PrismaClient, VisaType, Difficulty, QuestionTopic } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始扩展题库填充...');

  // F1 学生签证题目（60道）
  const f1Questions = [
    // 个人信息类 (10题)
    {
      textEn: "Tell me about yourself.",
      textZh: "介绍一下你自己。",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["What are your hobbies?", "What is your greatest achievement?"],
      tips: "简洁介绍背景，保持积极正面，避免过长。"
    },
    {
      textEn: "What is your name and where are you from?",
      textZh: "你叫什么名字？来自哪里？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["How do you spell your last name?"],
      tips: "清晰回答，可以简单介绍家乡。"
    },
    {
      textEn: "What do your parents do for a living?",
      textZh: "你父母是做什么工作的？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Are they supporting your education?"],
      tips: "简单说明职业，展示家庭稳定性。"
    },
    {
      textEn: "Do you have any siblings?",
      textZh: "你有兄弟姐妹吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["What do they do?"],
      tips: "如实回答，简单介绍。"
    },
    {
      textEn: "What are your strengths and weaknesses?",
      textZh: "你的优点和缺点是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How do you plan to improve your weaknesses?"],
      tips: "优点要与学习相关，缺点要有改进计划。"
    },
    {
      textEn: "What do you do in your free time?",
      textZh: "你业余时间做什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["How will you continue these activities in the US?"],
      tips: "展示积极健康的兴趣爱好。"
    },
    {
      textEn: "Have you traveled abroad before?",
      textZh: "你以前出过国吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["Where did you go?", "Did you return on time?"],
      tips: "如实回答，如有出国记录要说明按时返回。"
    },
    {
      textEn: "What languages do you speak?",
      textZh: "你会说什么语言？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["How is your English level?"],
      tips: "诚实回答语言能力。"
    },
    {
      textEn: "Are you married or in a relationship?",
      textZh: "你结婚了吗或者有恋爱关系吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Is your partner coming with you?"],
      tips: "如实回答，强调国内的联系。"
    },
    {
      textEn: "What is your current occupation or status?",
      textZh: "你目前的职业或状态是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["When did you graduate?"],
      tips: "清楚说明当前状态。"
    },

    // 学习计划类 (15题)
    {
      textEn: "What is your intended major and why did you choose it?",
      textZh: "你的专业是什么？为什么选择这个专业？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.EASY,
      followUps: ["What specific courses are you most interested in?"],
      tips: "清晰说明专业和选择原因。"
    },
    {
      textEn: "Why did you choose this particular university?",
      textZh: "你为什么选择这所大学？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Did you apply to other universities?"],
      tips: "提及具体的教授、项目或学校特色。"
    },
    {
      textEn: "What do you know about your program?",
      textZh: "你对你的项目了解多少？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How long is the program?"],
      tips: "展示对项目的充分了解。"
    },
    {
      textEn: "Have you been admitted to other schools?",
      textZh: "你被其他学校录取了吗？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why did you choose this one?"],
      tips: "如实回答，说明选择理由。"
    },
    {
      textEn: "What will you study in your first year?",
      textZh: "你第一年会学什么？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Which courses are you most excited about?"],
      tips: "了解课程设置，展示准备充分。"
    },
    {
      textEn: "Who is your academic advisor or favorite professor?",
      textZh: "谁是你的学术导师或最喜欢的教授？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.HARD,
      followUps: ["What research do they do?"],
      tips: "如有导师，要了解其研究方向。"
    },
    {
      textEn: "Why do you want to study in the United States instead of your home country?",
      textZh: "为什么要去美国读书而不是在国内？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.HARD,
      followUps: ["What advantages does the US offer?"],
      tips: "强调美国在特定领域的优势。"
    },
    {
      textEn: "What is your educational background?",
      textZh: "你的教育背景是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["What was your GPA?"],
      tips: "按时间顺序说明学历。"
    },
    {
      textEn: "Did you take any standardized tests? What were your scores?",
      textZh: "你参加过标准化考试吗？分数是多少？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.EASY,
      followUps: ["TOEFL or IELTS?", "GRE or GMAT?"],
      tips: "准确说明考试成绩。"
    },
    {
      textEn: "What do you hope to learn from this program?",
      textZh: "你希望从这个项目中学到什么？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How will this help your career?"],
      tips: "展示明确的学习目标。"
    },
    {
      textEn: "Will you need to take any preparatory courses?",
      textZh: "你需要上预科课程吗？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.EASY,
      followUps: ["Why or why not?"],
      tips: "根据实际情况回答。"
    },
    {
      textEn: "What research interests do you have?",
      textZh: "你有什么研究兴趣？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.HARD,
      followUps: ["Have you done any research before?"],
      tips: "适用于研究生，要具体说明研究方向。"
    },
    {
      textEn: "How did you learn about this university?",
      textZh: "你是怎么了解到这所大学的？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.EASY,
      followUps: ["Did you visit the campus?"],
      tips: "说明信息来源渠道。"
    },
    {
      textEn: "What makes you a good fit for this program?",
      textZh: "为什么你适合这个项目？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.HARD,
      followUps: ["What unique qualities do you bring?"],
      tips: "强调个人优势与项目的匹配度。"
    },
    {
      textEn: "Are you planning to pursue a PhD after your Master's?",
      textZh: "硕士毕业后你打算读博士吗？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Where would you do it?"],
      tips: "如实回答，但强调会回国。"
    },

    // 财务状况类 (10题)
    {
      textEn: "How will you finance your education in the United States?",
      textZh: "你如何支付在美国的学费和生活费？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Do you have any scholarships?"],
      tips: "明确说明资金来源和充足性。"
    },
    {
      textEn: "What is the total cost of your education per year?",
      textZh: "你每年的教育费用总共多少？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["Including living expenses?"],
      tips: "准确说明学费和生活费。"
    },
    {
      textEn: "Do you have a scholarship or financial aid?",
      textZh: "你有奖学金或助学金吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["How much is it?"],
      tips: "如实说明奖学金情况。"
    },
    {
      textEn: "Who will be your financial sponsor?",
      textZh: "谁是你的经济担保人？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["What is their annual income?"],
      tips: "说明担保人关系和经济能力。"
    },
    {
      textEn: "How much money do your parents make annually?",
      textZh: "你父母年收入是多少？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Can they afford your education?"],
      tips: "大致说明家庭收入水平。"
    },
    {
      textEn: "Do you have sufficient funds in your bank account?",
      textZh: "你的银行账户有足够的资金吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["How much do you have?"],
      tips: "确认有足够资金证明。"
    },
    {
      textEn: "Will you work while studying?",
      textZh: "你在学习期间会工作吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What kind of work?"],
      tips: "可以提及校内兼职，但不能依赖打工收入。"
    },
    {
      textEn: "How will you cover unexpected expenses?",
      textZh: "你如何应对意外开支？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Do you have emergency funds?"],
      tips: "说明有额外储蓄或家庭支持。"
    },
    {
      textEn: "Have you taken out any loans for your education?",
      textZh: "你为教育贷款了吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How much?"],
      tips: "尽量避免提及大额贷款。"
    },
    {
      textEn: "Can you show me your financial documents?",
      textZh: "能给我看看你的财务文件吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["Are these your parents' bank statements?"],
      tips: "准备好I-20和资金证明。"
    },

    // 职业规划类 (10题)
    {
      textEn: "What do you plan to do after graduation?",
      textZh: "毕业后你有什么计划？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Why not stay in the United States?"],
      tips: "明确表达回国意愿和计划。"
    },
    {
      textEn: "What kind of job do you want to have in the future?",
      textZh: "你将来想从事什么工作？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why that field?"],
      tips: "说明职业目标与所学专业的关系。"
    },
    {
      textEn: "How will your degree help you in your career?",
      textZh: "你的学位将如何帮助你的职业发展？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Give me a specific example"],
      tips: "说明学位对职业的具体帮助。"
    },
    {
      textEn: "Do you plan to return to your home country after graduation?",
      textZh: "毕业后你计划回国吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Why?", "What opportunities are there?"],
      tips: "强调回国计划和机会。"
    },
    {
      textEn: "What companies or organizations do you want to work for?",
      textZh: "你想为哪些公司或组织工作？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Do they have offices in your country?"],
      tips: "提及国内知名公司或跨国公司在国内的分支。"
    },
    {
      textEn: "Have you already secured a job back home?",
      textZh: "你在国内已经有工作保障了吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Tell me more about it"],
      tips: "如有工作意向或offer，可以提及。"
    },
    {
      textEn: "Why do you need a US degree for your career goals?",
      textZh: "为什么你的职业目标需要美国学位？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Can't you achieve this in your country?"],
      tips: "说明美国教育的独特价值。"
    },
    {
      textEn: "What is the job market like for your field in your country?",
      textZh: "你的专业在国内的就业市场怎么样？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Is there demand for your skills?"],
      tips: "展示对国内就业市场的了解。"
    },
    {
      textEn: "Do you have any work experience?",
      textZh: "你有工作经验吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["What did you do?"],
      tips: "如实介绍相关经验。"
    },
    {
      textEn: "How will studying in the US benefit your home country?",
      textZh: "在美国学习将如何使你的祖国受益？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Can you give specific examples?"],
      tips: "说明学成回国后的贡献。"
    },

    // 国内联系类 (8题)
    {
      textEn: "Do you have any relatives in the United States?",
      textZh: "你在美国有亲戚吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What do they do there?"],
      tips: "如实回答，有亲戚不一定是坏事。"
    },
    {
      textEn: "Why should I believe you will return to your country?",
      textZh: "我为什么应该相信你会回国？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.HARD,
      followUps: ["What ties do you have to your home country?"],
      tips: "强调家庭、职业和其他国内联系。"
    },
    {
      textEn: "Do you own any property in your home country?",
      textZh: "你在国内有房产吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Is it in your name?"],
      tips: "如有资产可以提及，显示国内根基。"
    },
    {
      textEn: "What will your family do while you're studying abroad?",
      textZh: "你留学期间家人会做什么？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.EASY,
      followUps: ["Will anyone visit you?"],
      tips: "说明家人在国内的生活和工作。"
    },
    {
      textEn: "Do you have a boyfriend/girlfriend? Where are they?",
      textZh: "你有男/女朋友吗？他们在哪里？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Are they coming with you?"],
      tips: "如实回答，如在国内可强调这是回国理由。"
    },
    {
      textEn: "Have any of your family members been denied a US visa?",
      textZh: "你的家人有被拒签过吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.HARD,
      followUps: ["Why were they denied?"],
      tips: "如实回答，说明自己情况不同。"
    },
    {
      textEn: "What city are you from? Tell me about it.",
      textZh: "你来自哪个城市？介绍一下。",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.EASY,
      followUps: ["What do you like about it?"],
      tips: "简单介绍家乡，表达对家乡的感情。"
    },
    {
      textEn: "Do you plan to bring your family to the US?",
      textZh: "你打算把家人带到美国吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.HARD,
      followUps: ["Why or why not?"],
      tips: "表明不打算，家人在国内有自己的生活。"
    },

    // 移民倾向类 (7题)
    {
      textEn: "Do you intend to immigrate to the United States?",
      textZh: "你打算移民美国吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["Why should I believe you?"],
      tips: "坚定表示没有移民意图。"
    },
    {
      textEn: "Have you ever applied for a green card?",
      textZh: "你申请过绿卡吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["Why did you apply?"],
      tips: "如实回答，通常应该是没有。"
    },
    {
      textEn: "Why shouldn't I assume you want to stay in the US permanently?",
      textZh: "我为什么不应该认为你想永久留在美国？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["Convince me"],
      tips: "强调回国的具体计划和理由。"
    },
    {
      textEn: "Do you have any plans to seek employment in the US after graduation?",
      textZh: "毕业后你有在美国找工作的计划吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["Not even OPT?"],
      tips: "可以提及OPT实习，但强调是短期的。"
    },
    {
      textEn: "What do you think about life in America?",
      textZh: "你对美国的生活有什么看法？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Would you like to live there permanently?"],
      tips: "客观评价，但不要过分赞美。"
    },
    {
      textEn: "Have you visited the US before? Did you return on time?",
      textZh: "你以前去过美国吗？按时回来了吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What did you do there?"],
      tips: "如去过，强调按时返回的记录。"
    },
    {
      textEn: "Why don't you want to immigrate to the US?",
      textZh: "你为什么不想移民美国？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["What's better about your country?"],
      tips: "说明对祖国的感情和国内的优势。"
    },
  ];

  // H1B 工作签证题目（30道）
  const h1bQuestions = [
    // 职位相关 (10题)
    {
      textEn: "What is your job title and what will you be doing?",
      textZh: "你的职位是什么？你将做什么工作？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["What are your specific responsibilities?"],
      tips: "明确职位名称和主要职责。"
    },
    {
      textEn: "Why does the company need to hire you instead of an American worker?",
      textZh: "公司为什么要雇用你而不是美国本地员工？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["What special skills do you have?"],
      tips: "强调独特技能和专业背景。"
    },
    {
      textEn: "What is your educational background?",
      textZh: "你的教育背景是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["What was your major?"],
      tips: "清晰说明学历和专业。"
    },
    {
      textEn: "How many years of experience do you have in this field?",
      textZh: "你在这个领域有多少年经验？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Where did you work before?"],
      tips: "说明工作经验和相关项目。"
    },
    {
      textEn: "What technologies or tools will you be using?",
      textZh: "你会使用什么技术或工具？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Are you proficient in them?"],
      tips: "列举具体的技术栈。"
    },
    {
      textEn: "Describe a typical day at work.",
      textZh: "描述一下你典型的工作日。",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Who will you work with?"],
      tips: "具体说明日常工作内容。"
    },
    {
      textEn: "What projects will you be working on?",
      textZh: "你会参与哪些项目？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Tell me more about these projects"],
      tips: "简要介绍项目内容。"
    },
    {
      textEn: "What is your salary?",
      textZh: "你的薪水是多少？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Is this the prevailing wage?"],
      tips: "与LCA上的薪水保持一致。"
    },
    {
      textEn: "Who is your direct supervisor?",
      textZh: "谁是你的直接上级？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["What is their background?"],
      tips: "如知道可以简单介绍。"
    },
    {
      textEn: "How did you find this job?",
      textZh: "你是怎么找到这份工作的？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Did you interview?"],
      tips: "说明求职过程。"
    },

    // 公司相关 (10题)
    {
      textEn: "Tell me about your company.",
      textZh: "介绍一下你的公司。",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What does the company do?"],
      tips: "了解公司业务和规模。"
    },
    {
      textEn: "How many employees does the company have?",
      textZh: "公司有多少员工？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Where are the offices located?"],
      tips: "大致了解公司规模。"
    },
    {
      textEn: "Is this a new position or a replacement?",
      textZh: "这是新职位还是替换职位？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why is it needed?"],
      tips: "了解职位背景。"
    },
    {
      textEn: "Where will you be working? Office location?",
      textZh: "你将在哪里工作？办公室位置？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Will you work remotely?"],
      tips: "说明工作地点。"
    },
    {
      textEn: "What industry is your company in?",
      textZh: "你的公司属于什么行业？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["What products or services?"],
      tips: "清楚说明行业和业务。"
    },
    {
      textEn: "Who are your company's main clients?",
      textZh: "你公司的主要客户是谁？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What projects do you do for them?"],
      tips: "如知道可以简单说明。"
    },
    {
      textEn: "How long has the company been in business?",
      textZh: "公司成立多久了？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Is it profitable?"],
      tips: "了解公司历史。"
    },
    {
      textEn: "Is the company sponsoring any other H1B employees?",
      textZh: "公司有为其他员工申请H1B吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How many?"],
      tips: "如知道可以说明。"
    },
    {
      textEn: "What is your company's annual revenue?",
      textZh: "你公司的年收入是多少？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Is it growing?"],
      tips: "大致了解即可。"
    },
    {
      textEn: "Will you work for the parent company or a subsidiary?",
      textZh: "你会为母公司还是子公司工作？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Explain the relationship"],
      tips: "如果是集团公司，说明关系。"
    },

    // 背景和资格 (10题)
    {
      textEn: "What degrees do you hold?",
      textZh: "你拥有什么学位？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["From which universities?"],
      tips: "清楚列举学位。"
    },
    {
      textEn: "How does your degree relate to your job?",
      textZh: "你的学位与工作有什么关系？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why is it required for this position?"],
      tips: "说明学历与工作的关联性。"
    },
    {
      textEn: "Do you have any certifications?",
      textZh: "你有任何资格证书吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Which ones?"],
      tips: "如有相关证书可以提及。"
    },
    {
      textEn: "What was your previous job?",
      textZh: "你之前的工作是什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Why did you leave?"],
      tips: "简要介绍之前的工作。"
    },
    {
      textEn: "Have you worked on H1B before?",
      textZh: "你之前用H1B工作过吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.MEDIUM,
      followUps: ["For which company?"],
      tips: "如实回答签证历史。"
    },
    {
      textEn: "Are you currently on OPT or another visa status?",
      textZh: "你目前是OPT还是其他签证状态？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["When does it expire?"],
      tips: "清楚说明当前身份。"
    },
    {
      textEn: "What programming languages do you know?",
      textZh: "你会什么编程语言？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Which are you most proficient in?"],
      tips: "列举相关技能。"
    },
    {
      textEn: "Have you published any papers or patents?",
      textZh: "你发表过论文或专利吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Tell me about them"],
      tips: "如有学术成果可以说明。"
    },
    {
      textEn: "What makes you qualified for this specialty occupation?",
      textZh: "什么使你有资格担任这个专业职位？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Give specific examples"],
      tips: "强调教育和经验的结合。"
    },
    {
      textEn: "Do you plan to pursue further education in the US?",
      textZh: "你打算在美国继续深造吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why or why not?"],
      tips: "根据实际情况回答。"
    },
  ];

  // B1/B2 旅游商务签证题目（30道）
  const b1b2Questions = [
    {
      textEn: "What is the purpose of your trip to the United States?",
      textZh: "你去美国的目的是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Tourism or business?"],
      tips: "清楚说明旅行目的。"
    },
    {
      textEn: "How long do you plan to stay in the US?",
      textZh: "你计划在美国停留多久？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["When will you return?"],
      tips: "说明具体的时间范围。"
    },
    {
      textEn: "Have you booked your flights and hotel?",
      textZh: "你预订了机票和酒店吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Can I see your itinerary?"],
      tips: "最好已有预订证明。"
    },
    {
      textEn: "Where will you stay during your visit?",
      textZh: "你访问期间会住在哪里？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["With family or in a hotel?"],
      tips: "提供具体住宿信息。"
    },
    {
      textEn: "Which cities will you visit?",
      textZh: "你会访问哪些城市？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Why those cities?"],
      tips: "列出行程计划。"
    },
    {
      textEn: "Who will you travel with?",
      textZh: "你会和谁一起旅行？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Are they applying too?"],
      tips: "说明同行人员。"
    },
    {
      textEn: "How will you finance your trip?",
      textZh: "你如何支付旅行费用？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Can you show me bank statements?"],
      tips: "说明有足够资金。"
    },
    {
      textEn: "What is your occupation?",
      textZh: "你的职业是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["How long have you been working there?"],
      tips: "说明稳定的工作。"
    },
    {
      textEn: "Do you have family in the United States?",
      textZh: "你在美国有家人吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Will you visit them?"],
      tips: "如实回答。"
    },
    {
      textEn: "What ties do you have to your home country?",
      textZh: "你与祖国有什么联系？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.HARD,
      followUps: ["Why will you return?"],
      tips: "强调工作、家庭、财产等联系。"
    },
    {
      textEn: "Have you traveled abroad before?",
      textZh: "你以前出过国吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["Where did you go?"],
      tips: "如有良好出境记录，说明按时返回。"
    },
    {
      textEn: "Why do you want to visit the US now?",
      textZh: "你为什么现在想访问美国？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why not earlier or later?"],
      tips: "说明时机的合理性。"
    },
    {
      textEn: "What attractions or places do you want to see?",
      textZh: "你想看什么景点或地方？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Why those places?"],
      tips: "展示对目的地的了解。"
    },
    {
      textEn: "Do you have travel insurance?",
      textZh: "你有旅行保险吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["What does it cover?"],
      tips: "最好已购买。"
    },
    {
      textEn: "Have you been to the US before?",
      textZh: "你以前去过美国吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["When? For how long?"],
      tips: "如去过，强调按时返回。"
    },
    {
      textEn: "What is your annual income?",
      textZh: "你的年收入是多少？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Can you afford this trip?"],
      tips: "证明有足够经济能力。"
    },
    {
      textEn: "Are you retired?",
      textZh: "你退休了吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["What did you do before?"],
      tips: "如退休，说明之前的工作。"
    },
    {
      textEn: "Do you own property in your home country?",
      textZh: "你在国内有房产吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Is it yours or your family's?"],
      tips: "资产是回国保证。"
    },
    {
      textEn: "What will you do when you return home?",
      textZh: "回国后你会做什么？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Continue working?"],
      tips: "说明回国后的生活。"
    },
    {
      textEn: "Is this your first time applying for a US visa?",
      textZh: "这是你第一次申请美国签证吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["Have you been denied before?"],
      tips: "如实回答。"
    },
    {
      textEn: "Who is paying for your trip?",
      textZh: "谁为你的旅行付费？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why are they paying?"],
      tips: "清楚说明资金来源。"
    },
    {
      textEn: "Do you speak English?",
      textZh: "你会说英语吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["How well?"],
      tips: "诚实回答英语水平。"
    },
    {
      textEn: "What do you do for a living?",
      textZh: "你以什么为生？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Tell me about your job"],
      tips: "简要介绍职业。"
    },
    {
      textEn: "Are you traveling alone?",
      textZh: "你一个人旅行吗？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Why alone?"],
      tips: "说明独自或结伴旅行的原因。"
    },
    {
      textEn: "What is your marital status?",
      textZh: "你的婚姻状况？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Do you have children?"],
      tips: "家庭是回国的重要联系。"
    },
    {
      textEn: "How long is your vacation from work?",
      textZh: "你的工作假期有多长？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Do you have approval from your employer?"],
      tips: "证明需要回国工作。"
    },
    {
      textEn: "What is your itinerary?",
      textZh: "你的行程是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["Day by day?"],
      tips: "准备详细行程表。"
    },
    {
      textEn: "Why should I give you a visa?",
      textZh: "我为什么应该给你签证？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: ["Convince me"],
      tips: "综合说明自己的情况和回国保证。"
    },
    {
      textEn: "Have you ever overstayed a visa?",
      textZh: "你曾经逾期滞留过吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.HARD,
      followUps: ["Why?"],
      tips: "如实回答，最好没有。"
    },
    {
      textEn: "What is your purpose for this specific trip?",
      textZh: "这次具体旅行的目的是什么？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Any special occasions?"],
      tips: "说明具体目的，如参加会议、探亲等。"
    },
  ];

  // J1 交流访问签证题目（15道）
  const j1Questions = [
    {
      textEn: "What is the purpose of your exchange program?",
      textZh: "你的交流项目的目的是什么？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What will you do?"],
      tips: "清楚说明项目内容。"
    },
    {
      textEn: "Who is sponsoring your J1 program?",
      textZh: "谁赞助你的J1项目？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["Tell me about the organization"],
      tips: "说明赞助机构。"
    },
    {
      textEn: "How long will you be in the United States?",
      textZh: "你会在美国待多久？",
      topic: QuestionTopic.PERSONAL_INFO,
      difficulty: Difficulty.EASY,
      followUps: ["What are the program dates?"],
      tips: "与DS-2019表格一致。"
    },
    {
      textEn: "What will you do after the program ends?",
      textZh: "项目结束后你会做什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Will you return home?"],
      tips: "明确表示会回国。"
    },
    {
      textEn: "Tell me about your host institution.",
      textZh: "介绍一下你的接待机构。",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.MEDIUM,
      followUps: ["What do they do?"],
      tips: "了解接待单位情况。"
    },
    {
      textEn: "What research or work will you be doing?",
      textZh: "你会做什么研究或工作？",
      topic: QuestionTopic.STUDY_PLAN,
      difficulty: Difficulty.MEDIUM,
      followUps: ["In what capacity?"],
      tips: "具体说明交流内容。"
    },
    {
      textEn: "Who will supervise you during the program?",
      textZh: "项目期间谁会指导你？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.EASY,
      followUps: ["What is their background?"],
      tips: "如知道导师信息可以说明。"
    },
    {
      textEn: "How will this program benefit your career?",
      textZh: "这个项目将如何有益于你的职业？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Give specific examples"],
      tips: "说明项目价值。"
    },
    {
      textEn: "Are you being paid during this program?",
      textZh: "项目期间你会有报酬吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["How much?"],
      tips: "与DS-2019表格一致。"
    },
    {
      textEn: "What is your current position in your home country?",
      textZh: "你在国内目前的职位是什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["How long have you worked there?"],
      tips: "证明有稳定工作要回去。"
    },
    {
      textEn: "Will your employer hold your position while you're away?",
      textZh: "你不在期间雇主会保留你的职位吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Do you have a letter?"],
      tips: "最好有工作单位的支持信。"
    },
    {
      textEn: "Have you participated in exchange programs before?",
      textZh: "你以前参加过交流项目吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["Where? When?"],
      tips: "如有，说明按时返回的记录。"
    },
    {
      textEn: "What is the two-year home residency requirement?",
      textZh: "什么是两年回国居住要求？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: ["Does it apply to you?"],
      tips: "了解212(e)条款。"
    },
    {
      textEn: "How will you share what you learn with your home country?",
      textZh: "你将如何与祖国分享所学？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Give specific plans"],
      tips: "说明回国后的贡献计划。"
    },
    {
      textEn: "Why was your program approved by the State Department?",
      textZh: "为什么你的项目被国务院批准？",
      topic: QuestionTopic.PROGRAM_DETAILS,
      difficulty: Difficulty.HARD,
      followUps: ["What public diplomacy goals does it serve?"],
      tips: "了解J1签证的交流目的。"
    },
  ];

  // L1 公司内部调动签证题目（15道）
  const l1Questions = [
    {
      textEn: "What is your position in the company?",
      textZh: "你在公司的职位是什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["What are your responsibilities?"],
      tips: "清楚说明职位。"
    },
    {
      textEn: "How long have you worked for this company?",
      textZh: "你在这家公司工作多久了？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["In what capacity?"],
      tips: "L1需要至少一年工作经验。"
    },
    {
      textEn: "Explain the relationship between the US and foreign company.",
      textZh: "解释一下美国公司和外国公司的关系。",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Parent, subsidiary, or affiliate?"],
      tips: "了解公司结构关系。"
    },
    {
      textEn: "What will you be doing in the US office?",
      textZh: "你在美国办公室会做什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How is it different from your current role?"],
      tips: "说明调动后的工作内容。"
    },
    {
      textEn: "Is this a temporary or permanent transfer?",
      textZh: "这是临时还是永久调动？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How long will you stay?"],
      tips: "L1通常是临时调动。"
    },
    {
      textEn: "Do you have specialized knowledge of the company?",
      textZh: "你有公司的专业知识吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["What makes your knowledge special?"],
      tips: "L1B需要证明专业知识。"
    },
    {
      textEn: "Are you a manager or executive? What is your level?",
      textZh: "你是经理还是高管？你的级别是什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["How many people do you manage?"],
      tips: "L1A需要管理职责。"
    },
    {
      textEn: "Will you open a new office in the US?",
      textZh: "你会在美国开设新办公室吗？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Tell me about the business plan"],
      tips: "新办公室L1有特殊要求。"
    },
    {
      textEn: "What is your salary in the US?",
      textZh: "你在美国的薪水是多少？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.EASY,
      followUps: ["Is it more or less than your current salary?"],
      tips: "与申请材料一致。"
    },
    {
      textEn: "Who will you report to in the US office?",
      textZh: "你在美国办公室向谁汇报？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["What is their position?"],
      tips: "了解美国办公室的管理结构。"
    },
    {
      textEn: "How many employees does the US office have?",
      textZh: "美国办公室有多少员工？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.EASY,
      followUps: ["Is it growing?"],
      tips: "了解美国办公室规模。"
    },
    {
      textEn: "What is the business relationship between the two offices?",
      textZh: "两个办公室之间的业务关系是什么？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Do they work on the same projects?"],
      tips: "说明业务联系。"
    },
    {
      textEn: "Do you plan to return to your home country office?",
      textZh: "你打算回到本国办公室吗？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.HARD,
      followUps: ["When?"],
      tips: "表明是临时调动。"
    },
    {
      textEn: "Have you worked in the US for this company before?",
      textZh: "你以前为这家公司在美国工作过吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.EASY,
      followUps: ["On what visa?"],
      tips: "如实回答工作历史。"
    },
    {
      textEn: "What percentage of your work will be managerial?",
      textZh: "你工作中管理职责占多少比例？",
      topic: QuestionTopic.CAREER,
      difficulty: Difficulty.HARD,
      followUps: ["Describe your daily activities"],
      tips: "L1A需要主要从事管理工作。"
    },
  ];

  console.log('开始插入题目到数据库...');
  
  let totalCreated = 0;

  // 插入所有题目
  for (const q of [...f1Questions, ...h1bQuestions, ...b1b2Questions, ...j1Questions, ...l1Questions]) {
    const rubric = {
      content: { weight: 40, criteria: "回答完整性和相关性" },
      language: { weight: 30, criteria: "语法、词汇和流利度" },
      performance: { weight: 20, criteria: "自信、简洁和逻辑性" },
      risk: { weight: 10, criteria: "是否有移民倾向或矛盾" }
    };

    await prisma.question.create({
      data: {
        text: q.textEn,
        textEn: q.textEn,
        textZh: q.textZh,
        visaType: q.textEn.includes('company') || q.textEn.includes('manager') || q.textEn.includes('transfer') ? 
                  (q.textEn.includes('exchange') || q.textEn.includes('research') ? VisaType.J1_EXCHANGE : 
                   q.textEn.includes('visit') || q.textEn.includes('tourism') ? VisaType.B1B2_TOURIST :
                   q.textEn.includes('position') || q.textEn.includes('specialized') ? VisaType.L1_TRANSFER : VisaType.H1B_WORK) :
                  VisaType.F1_STUDENT,
        country: 'USA',
        topic: q.topic,
        difficulty: q.difficulty,
        followUps: q.followUps || [],
        rubric: rubric,
        sampleAnswer: '',
        tips: q.tips,
      },
    });
    totalCreated++;
  }

  console.log(`✅ 成功创建 ${totalCreated} 道题目`);
  console.log('题目分布:');
  console.log(`  - F1 学生签证: ${f1Questions.length} 道`);
  console.log(`  - H1B 工作签证: ${h1bQuestions.length} 道`);
  console.log(`  - B1/B2 旅游签证: ${b1b2Questions.length} 道`);
  console.log(`  - J1 交流签证: ${j1Questions.length} 道`);
  console.log(`  - L1 调动签证: ${l1Questions.length} 道`);
  console.log(`  - 总计: ${totalCreated} 道`);
}

main()
  .catch((e) => {
    console.error('❌ 扩展题库填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
