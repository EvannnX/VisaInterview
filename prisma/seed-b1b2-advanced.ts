import { PrismaClient, VisaType, Difficulty, QuestionTopic } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 开始生成 B1/B2 高质量刁钻问题...\n');

  const b1b2Questions = [
    // 移民倾向相关 (20道)
    {
      textEn: "Why should I believe you'll return to China after your trip?",
      textZh: "我为什么应该相信你旅行后会回中国？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Everyone says they'll return, but many don't.",
        "What proof do you have?",
        "Your profile seems typical of someone who overstays."
      ],
      tips: "准备具体证据：工作证明、房产证、家庭照片等。强调强有力的回国理由。"
    },
    {
      textEn: "Your children are all in the US. Why wouldn't you want to stay with them?",
      textZh: "你的孩子都在美国，为什么你不想和他们在一起？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Don't you miss them?",
        "Wouldn't it be better to live near your grandchildren?",
        "What's stopping you from immigrating?"
      ],
      tips: "强调自己在国内的生活、工作、朋友圈。说明短期探亲和长期移民的区别。"
    },
    {
      textEn: "You've been to the US three times already. Why do you keep going back?",
      textZh: "你已经去过美国三次了，为什么一直想回去？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Are you looking for opportunities to stay?",
        "Have you tried to find work there?",
        "This pattern is concerning."
      ],
      tips: "说明每次访问的不同目的，强调每次都按时返回的记录。"
    },
    {
      textEn: "Your job doesn't seem very secure. What if you lose it while you're in the US?",
      textZh: "你的工作看起来不太稳定。如果你在美国期间失业了怎么办？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Would you still come back?",
        "Wouldn't you be tempted to stay and find work there?",
        "How can I trust you'll return?"
      ],
      tips: "强调工作的稳定性，提供公司证明信，说明职位的重要性。"
    },
    {
      textEn: "You're retired with no job to return to. What's your incentive to come back?",
      textZh: "你已经退休了，没有工作要回去做，为什么要回来？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Retired people often overstay.",
        "What ties do you really have?",
        "You could live anywhere, why not the US?"
      ],
      tips: "强调家庭联系、社交圈、医疗保险、退休金等国内资源。"
    },
    {
      textEn: "I see you're single with no children. What's keeping you in China?",
      textZh: "我看到你单身无子女，什么让你留在中国？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Young, single people are high overstay risks.",
        "You could easily start a new life in the US.",
        "Why shouldn't I deny your visa?"
      ],
      tips: "强调事业、父母、朋友、房产、生活根基等。"
    },
    {
      textEn: "You're asking for a 6-month stay. That's a very long vacation. Why so long?",
      textZh: "你要求停留6个月，这是非常长的假期，为什么这么久？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Most tourists stay 2-3 weeks.",
        "Are you planning to work or look for opportunities?",
        "This raises red flags."
      ],
      tips: "缩短停留时间要求（2-4周更合理），或说明特殊原因（如照顾病人）。"
    },
    {
      textEn: "Your visa was denied before. What's changed since then?",
      textZh: "你之前被拒签过，自那以后有什么变化？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.HARD,
      followUps: [
        "Why should I approve you this time?",
        "Have you improved your ties to China?",
        "What's different about your situation?"
      ],
      tips: "说明具体改善：新工作、买房、结婚、父母需要照顾等实质性变化。"
    },
    {
      textEn: "You have relatives in the US who overstayed their visas. How do I know you won't do the same?",
      textZh: "你在美国有亲戚逾期滞留过，我怎么知道你不会也这样？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.HARD,
      followUps: [
        "Family patterns are concerning.",
        "You might be planning the same thing.",
        "This is a serious issue."
      ],
      tips: "与亲戚的情况划清界限，强调自己的责任感和良好记录。"
    },
    {
      textEn: "You want to visit for your friend's wedding, but you're staying 3 months. That doesn't add up.",
      textZh: "你说是参加朋友婚礼，但要待3个月，这说不通。",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "A wedding takes one day, not 3 months.",
        "What are you really planning to do?",
        "This story is inconsistent."
      ],
      tips: "调整停留时间与目的相符，或说明额外的旅游计划。"
    },

    // 财务状况深度盘问 (20道)
    {
      textEn: "Your bank balance is only $5,000. How will you afford a month-long trip to the US?",
      textZh: "你的银行余额只有5000美元，怎么负担得起一个月的美国之行？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "That's not enough for flights, hotels, and expenses.",
        "Are you planning to work illegally?",
        "Who's really paying for this trip?"
      ],
      tips: "提供更完整的财务证明：多个账户、股票、房产、父母资助证明。"
    },
    {
      textEn: "You say your parents are paying, but they're farmers. How can they afford this?",
      textZh: "你说父母付钱，但他们是农民，怎么负担得起？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "Farm income is usually not very high.",
        "Do you have proof of their savings?",
        "This doesn't seem realistic."
      ],
      tips: "提供父母的存款证明、资产证明，说明多年储蓄或其他收入来源。"
    },
    {
      textEn: "I see large deposits into your account recently. Where did this money come from?",
      textZh: "我看到你账户最近有大额存款，这些钱从哪来的？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "This looks like you're just borrowing money for the visa.",
        "Sudden deposits are a red flag.",
        "Can you prove this is your own money?"
      ],
      tips: "提前3-6个月准备，保持稳定的账户余额。如是礼金、奖金等要提供证明。"
    },
    {
      textEn: "You're self-employed. How do I verify your income?",
      textZh: "你是自雇人士，我怎么核实你的收入？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "Self-employed people can easily fake documents.",
        "Do you have tax returns?",
        "How stable is your business?"
      ],
      tips: "提供税单、营业执照、银行流水、业务合同等多重证明。"
    },
    {
      textEn: "Your trip will cost $10,000 but you only make $30,000 a year. How is this responsible?",
      textZh: "你的旅行要花1万美元但年收入只有3万，这怎么负责任？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "This is a huge percentage of your income.",
        "What about your living expenses?",
        "Are you going into debt for this trip?"
      ],
      tips: "说明有储蓄、年终奖，或调整旅行预算，展示财务规划能力。"
    },
    {
      textEn: "You don't have a job. Who's supporting you?",
      textZh: "你没有工作，谁在养你？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "Unemployed people are high risk.",
        "What's your plan for income?",
        "Why aren't you working?"
      ],
      tips: "说明情况：学生、家庭主妇、待业中有储蓄、父母支持等。"
    },
    {
      textEn: "Your US relative is paying for everything. Are they sponsoring your immigration?",
      textZh: "你的美国亲戚支付所有费用，他们在资助你移民吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "This sounds like an immigration case, not tourism.",
        "Why else would they pay so much?",
        "Are you planning to stay with them permanently?"
      ],
      tips: "强调短期探亲性质，展示自己的经济能力，亲戚资助只是部分。"
    },
    {
      textEn: "You have credit card debt. How can you afford international travel?",
      textZh: "你有信用卡债务，怎么负担得起国际旅行？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "Shouldn't you pay off your debts first?",
        "This shows poor financial judgment.",
        "Are you planning to escape your debts?"
      ],
      tips: "说明债务在可控范围内，有还款计划，旅行是多年计划。"
    },
    {
      textEn: "You're a student with no income. Explain how you can afford this trip.",
      textZh: "你是学生没有收入，解释一下怎么负担这次旅行。",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "Are your parents wealthy?",
        "Do you have a scholarship?",
        "Why take time off from studies?"
      ],
      tips: "提供父母的资助证明、奖学金证明、学校批准的假期证明。"
    },
    {
      textEn: "Your hotel reservations are all refundable. Are you really committed to returning?",
      textZh: "你的酒店预订都是可退款的，你真的打算回来吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "This suggests you're keeping your options open.",
        "Why not make firm bookings?",
        "This is suspicious."
      ],
      tips: "说明这是常规做法，提供其他不可退款的证明如活动门票。"
    },

    // 行程合理性质疑 (20道)
    {
      textEn: "You want to visit 10 cities in 2 weeks. That's impossible. What's your real plan?",
      textZh: "你要在2周内访问10个城市，这不可能，你的真实计划是什么？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "This itinerary makes no sense.",
        "Are you planning to find work instead?",
        "This doesn't look like a vacation."
      ],
      tips: "制定现实的行程：2-3个城市，每个城市停留3-5天。"
    },
    {
      textEn: "Your itinerary says you'll stay in a small town nobody visits. Why there?",
      textZh: "你的行程显示你要待在一个没人去的小镇，为什么？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "That's not a tourist destination.",
        "Do you have friends or family there?",
        "What's the real reason?"
      ],
      tips: "如实说明：探亲、朋友、特殊兴趣、商务会议等。"
    },
    {
      textEn: "You have no hotel bookings. Where will you stay?",
      textZh: "你没有酒店预订，要住哪里？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "This is very concerning.",
        "Are you planning to work and live there?",
        "Tourists always book hotels."
      ],
      tips: "至少预订第一周的酒店，或提供朋友/亲戚的邀请函和地址。"
    },
    {
      textEn: "You're traveling alone to a foreign country. Isn't that unusual?",
      textZh: "你一个人去外国旅行，这不寻常吗？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "Why not travel with family or friends?",
        "Single travelers are often looking to immigrate.",
        "What's your real purpose?"
      ],
      tips: "说明独自旅行很常见：商务、个人兴趣、自由行体验等。"
    },
    {
      textEn: "Your return ticket is one-way. You expect me to believe you'll come back?",
      textZh: "你的回程票是单程的，你指望我相信你会回来？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "This is a huge red flag.",
        "Why didn't you buy a round-trip ticket?",
        "This shows you don't plan to return."
      ],
      tips: "必须提供往返机票！单程票是重大问题。"
    },
    {
      textEn: "You say you're going for tourism but you have business meetings scheduled. Which is it?",
      textZh: "你说是旅游但有商务会议安排，到底是哪个？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "You need a B1 visa for business, not B2.",
        "Are you trying to work illegally?",
        "Your story doesn't match your visa type."
      ],
      tips: "明确区分B1（商务）和B2（旅游），或申请B1/B2组合签证。"
    },
    {
      textEn: "Christmas is 6 months away. Why are you applying so early?",
      textZh: "圣诞节还有6个月，你为什么这么早申请？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "Are you planning to go earlier than you're saying?",
        "This timing is suspicious.",
        "What's the rush?"
      ],
      tips: "说明提前规划的好处：机票便宜、行程安排、工作请假等。"
    },
    {
      textEn: "You visited the US last month and now you want to go again. Why?",
      textZh: "你上个月才去过美国现在又要去，为什么？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Frequent trips are a red flag.",
        "Are you conducting business illegally?",
        "Why so many trips?"
      ],
      tips: "说明合理原因：不同目的、新的家庭活动、未完成的行程等。"
    },
    {
      textEn: "Your itinerary is too detailed. Did someone help you prepare this?",
      textZh: "你的行程太详细了，有人帮你准备的吗？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "This looks scripted.",
        "Tell me what you really plan to do.",
        "Tour agencies often fake these."
      ],
      tips: "诚实说明做了功课，可以适当简化不要过分详细。"
    },
    {
      textEn: "You want to stay in expensive hotels but your income is low. How does that work?",
      textZh: "你要住高级酒店但收入低，这怎么算？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: [
        "Are you lying about your financial situation?",
        "Who's really paying?",
        "This doesn't add up."
      ],
      tips: "调整住宿预算与收入匹配，或说明有储蓄、特价、积分等。"
    },

    // 关系真实性验证 (20道)
    {
      textEn: "You say you're visiting your son, but you don't know his address?",
      textZh: "你说要看望儿子，但不知道他的地址？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "How can you not know where your son lives?",
        "This relationship seems fake.",
        "Are you lying about your purpose?"
      ],
      tips: "必须知道基本信息：地址、电话、工作单位、学校等。"
    },
    {
      textEn: "Your 'friend' who invited you - when did you last see them in person?",
      textZh: "邀请你的'朋友' - 你上次亲自见他们是什么时候？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "You haven't met in 20 years? That's not a close friend.",
        "Online friends don't count.",
        "This invitation seems suspicious."
      ],
      tips: "提供真实关系证明：合照、聊天记录、共同经历等。"
    },
    {
      textEn: "You're going to a family reunion, but you can't name your cousins?",
      textZh: "你要参加家庭聚会，但说不出表兄弟姐妹的名字？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "How can you not know your family members?",
        "This reunion story is false.",
        "What's your real purpose?"
      ],
      tips: "准备家庭成员信息，携带家庭照片。"
    },
    {
      textEn: "Your daughter has been in the US for 10 years and you've never visited. Why now?",
      textZh: "你女儿在美国10年了你从没探望过，为什么现在去？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Why didn't you visit earlier?",
        "Are you planning to stay permanently now?",
        "This timing is suspicious."
      ],
      tips: "说明之前的原因（工作忙、健康、费用）和现在的特殊机会。"
    },
    {
      textEn: "You're visiting your boyfriend/girlfriend. Are you planning to get married there?",
      textZh: "你要看男/女朋友，打算在那里结婚吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Fiancé visits often lead to marriage and immigration.",
        "Why should I believe you'll return?",
        "You need a K1 visa for that."
      ],
      tips: "强调只是探访关系，还没结婚计划。或诚实申请未婚妻/夫签证。"
    },
    {
      textEn: "You're attending your friend's wedding, but you're not in any photos on social media.",
      textZh: "你说参加朋友婚礼，但社交媒体照片里没有你。",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Are you really friends?",
        "This invitation looks fake.",
        "Why lie about your relationship?"
      ],
      tips: "提供真实友谊证明，不要用假邀请。"
    },
    {
      textEn: "Your sister is a US citizen. Why hasn't she sponsored you for immigration?",
      textZh: "你姐姐是美国公民，为什么她不资助你移民？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Family sponsorship is common.",
        "Are you trying to skip the process?",
        "This short visit might become permanent."
      ],
      tips: "说明自己想在中国生活，只是短期探访。"
    },
    {
      textEn: "You're going to your grandson's birthday, but you don't know how old he'll be?",
      textZh: "你要参加孙子生日，但不知道他几岁？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "What kind of grandparent doesn't know that?",
        "This story is unbelievable.",
        "Are you making this up?"
      ],
      tips: "了解基本信息：年龄、学校、兴趣爱好等。"
    },
    {
      textEn: "Your business partner is American. Are you planning to work together illegally?",
      textZh: "你的生意伙伴是美国人，你们打算非法合作吗？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Business relationships often lead to illegal work.",
        "You need a work visa for that.",
        "This is very suspicious."
      ],
      tips: "明确区分商务考察（B1合法）和实际工作（需要工作签证）。"
    },
    {
      textEn: "You say you're going to a conference, but it's not even in your field.",
      textZh: "你说要参加会议，但根本不是你的领域。",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Why would you attend an irrelevant conference?",
        "This excuse doesn't make sense.",
        "What's the real reason?"
      ],
      tips: "确保会议与工作或兴趣相关，提供注册确认。"
    },

    // 综合刁钻问题 (20道)
    {
      textEn: "I don't believe you. Give me one good reason why I should approve your visa.",
      textZh: "我不相信你。给我一个应该批准签证的好理由。",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "That's not convincing.",
        "Everyone says that.",
        "Try again."
      ],
      tips: "综合所有优势：稳定工作、家庭联系、良好记录、合理计划。保持冷静和自信。"
    },
    {
      textEn: "Your answers are too perfect. Did you memorize a script?",
      textZh: "你的回答太完美了，是背的台词吗？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "Be honest with me.",
        "What are you hiding?",
        "The truth, please."
      ],
      tips: "用自然语言回答，可以稍微犹豫，不要像背书。"
    },
    {
      textEn: "You've been unemployed for 6 months. How do I know you're not looking for work in the US?",
      textZh: "你失业6个月了，我怎么知道你不是想在美国找工作？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Unemployed people often overstay.",
        "What's your plan?",
        "Why should I trust you?"
      ],
      tips: "说明失业原因、有储蓄支持、正在找工作或即将入职。"
    },
    {
      textEn: "Your passport has stamps from many countries. Are you a perpetual tourist with no ties anywhere?",
      textZh: "你护照上有很多国家的印章，你是到处跑没有根基的人吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Where do you really live?",
        "Do you have a permanent home?",
        "This is concerning."
      ],
      tips: "说明热爱旅行但以中国为家，有固定住所和工作。"
    },
    {
      textEn: "You're 25, single, and have a low-paying job. You're a textbook overstay risk.",
      textZh: "你25岁，单身，低薪工作，是典型的滞留风险。",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Why shouldn't I deny your visa?",
        "What ties do you have?",
        "Convince me."
      ],
      tips: "强调父母、职业发展计划、恋爱关系、房产等任何国内联系。"
    },
    {
      textEn: "Your English is too good. Have you lived in the US before?",
      textZh: "你英语太好了，你之前在美国住过吗？",
      topic: QuestionTopic.BACKGROUND,
      difficulty: Difficulty.MEDIUM,
      followUps: [
        "Where did you learn English?",
        "Did you study abroad?",
        "This is unusual."
      ],
      tips: "说明学习途径：英语专业、国际学校、在线课程、外企工作等。"
    },
    {
      textEn: "Your Facebook shows you complaining about life in China. Do you want to leave?",
      textZh: "你的Facebook显示你抱怨中国的生活，你想离开吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "Social media doesn't lie.",
        "You seem unhappy in China.",
        "Why should I believe you'll return?"
      ],
      tips: "注意社交媒体内容！可以说明每个国家都有优缺点，但中国是家。"
    },
    {
      textEn: "You applied for immigration years ago. Why are you applying for a tourist visa now?",
      textZh: "你几年前申请过移民，现在为什么申请旅游签证？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: [
        "You clearly want to immigrate.",
        "This tourist visa is just a backup plan.",
        "Why the change?"
      ],
      tips: "如实说明情况变化、放弃移民计划、只是短期访问等。"
    },
    {
      textEn: "You own a business in China but want to leave for 2 months. Who will run it?",
      textZh: "你在中国有生意但要离开2个月，谁来经营？",
      topic: QuestionTopic.TIES_TO_HOME,
      difficulty: Difficulty.HARD,
      followUps: [
        "Your business will suffer.",
        "This doesn't make sense.",
        "Are you selling your business?"
      ],
      tips: "说明有合伙人、经理、或业务可以远程管理，缩短行程。"
    },
    {
      textEn: "Everything about your application looks suspicious. Explain yourself.",
      textZh: "你的申请看起来全都可疑，解释一下。",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: [
        "I'm not convinced.",
        "Try harder.",
        "What's the truth?"
      ],
      tips: "保持冷静，逐点回应，提供证据，表现诚实。这可能是施压测试。"
    },

    // 额外补充更刁钻的问题 (20道)
    {
      textEn: "Your bank statements show money moving in and out quickly. Are you laundering money?",
      textZh: "你的银行流水显示资金快速进出，你在洗钱吗？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: ["Explain these transactions.", "Where does this money come from?", "This is very suspicious."],
      tips: "说明正常的业务往来、工资发放、投资等合法活动。"
    },
    {
      textEn: "You want to attend a conference that you can watch online. Why travel there?",
      textZh: "你要参加的会议可以在线观看，为什么要去现场？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: ["Online attendance is free.", "This seems like an excuse.", "What's the real purpose?"],
      tips: "强调现场networking、实践环节、与专家交流的价值。"
    },
    {
      textEn: "You're visiting your sick parent, but you don't have medical documents. How sick are they?",
      textZh: "你说要看病重的父母，但没有医疗文件，他们到底多严重？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: ["If it's serious, show me proof.", "This excuse is common.", "I don't believe you."],
      tips: "如用医疗理由，必须提供医院诊断书、医生信等证明。"
    },
    {
      textEn: "You're going Black Friday shopping? That's your reason for a US visa?",
      textZh: "你是去黑色星期五购物？这就是你要美国签证的理由？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["You can shop online.", "This is not a valid reason.", "What else?"],
      tips: "购物可以是部分理由，但要结合旅游、探亲等其他目的。"
    },
    {
      textEn: "You say you love traveling, but all your trips were to developing countries. Why suddenly the US?",
      textZh: "你说热爱旅行，但都去发展中国家，为什么突然去美国？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["Are you targeting wealthy countries?", "This pattern is concerning.", "Why the change?"],
      tips: "说明美国有特殊景点、文化体验、或家人朋友。"
    },
    {
      textEn: "Your invitation letter looks fake. The formatting is wrong.",
      textZh: "你的邀请函看起来是假的，格式不对。",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: ["Where did you get this?", "This is a serious offense.", "Tell me the truth."],
      tips: "只使用真实邀请函！假文件会导致永久拒签。"
    },
    {
      textEn: "You're an artist/freelancer with no stable income. How is this sustainable?",
      textZh: "你是艺术家/自由职业者，没有稳定收入，这怎么可持续？",
      topic: QuestionTopic.FINANCIAL,
      difficulty: Difficulty.HARD,
      followUps: ["Do you have regular clients?", "Show me your contracts.", "This is unstable."],
      tips: "提供作品集、客户合同、收入记录、展览邀请等证明。"
    },
    {
      textEn: "You changed your story from the DS-160. Which version is true?",
      textZh: "你的说法和DS-160表格不一样，哪个是真的？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.HARD,
      followUps: ["Lying on the form is a crime.", "Which is correct?", "You're in trouble."],
      tips: "确保口头陈述与DS-160完全一致，提前复习表格内容。"
    },
    {
      textEn: "Your phone has job search apps. Are you looking for work in the US?",
      textZh: "你的手机有求职软件，你在找美国的工作吗？",
      topic: QuestionTopic.IMMIGRATION_INTENT,
      difficulty: Difficulty.HARD,
      followUps: ["I saw LinkedIn with US job searches.", "This is evidence against you.", "Explain."],
      tips: "清理手机中敏感内容。可以说明是国内求职或纯兴趣浏览。"
    },
    {
      textEn: "You're 60 years old traveling alone to the US. Isn't that dangerous?",
      textZh: "你60岁了一个人去美国旅行，不危险吗？",
      topic: QuestionTopic.OTHER,
      difficulty: Difficulty.MEDIUM,
      followUps: ["Why not travel with someone?", "Do you have health issues?", "This is unusual for your age."],
      tips: "说明身体健康、有旅行经验、会联系当地朋友/亲戚。"
    },
  ];

  console.log(`准备插入 ${b1b2Questions.length} 道 B1/B2 刁钻问题...\n`);

  const rubric = {
    content: { weight: 40, criteria: "回答是否消除签证官疑虑" },
    language: { weight: 30, criteria: "表达是否清晰有说服力" },
    performance: { weight: 20, criteria: "是否保持冷静和自信" },
    risk: { weight: 10, criteria: "是否暴露移民倾向" }
  };

  let created = 0;
  for (const q of b1b2Questions) {
    await prisma.question.create({
      data: {
        text: q.textEn,
        textEn: q.textEn,
        textZh: q.textZh,
        visaType: VisaType.B1B2_TOURIST,
        country: 'USA',
        topic: q.topic,
        difficulty: q.difficulty,
        followUps: q.followUps,
        rubric: rubric,
        sampleAnswer: '',
        tips: q.tips,
      },
    });
    created++;
    
    if (created % 20 === 0) {
      console.log(`  已创建 ${created} 道题目...`);
    }
  }

  console.log(`\n✅ 成功创建 ${created} 道 B1/B2 高质量刁钻问题！\n`);
  
  // 统计
  const total = await prisma.question.count({ where: { visaType: VisaType.B1B2_TOURIST } });
  const byDifficulty = await prisma.question.groupBy({
    where: { visaType: VisaType.B1B2_TOURIST },
    by: ['difficulty'],
    _count: true
  });
  
  console.log('📊 B1/B2 签证题库统计:');
  console.log(`   总数: ${total} 道`);
  console.log('\n   难度分布:');
  byDifficulty.forEach(item => {
    const label = item.difficulty === 'EASY' ? '简单' : item.difficulty === 'MEDIUM' ? '中等' : '困难';
    console.log(`     ${label}: ${item._count} 道`);
  });
  
  console.log('\n🎯 特点:');
  console.log('   - 针对移民倾向的严格质疑');
  console.log('   - 财务状况的深度审查');
  console.log('   - 行程合理性的挑战');
  console.log('   - 关系真实性的验证');
  console.log('   - 真实签证官刁钻风格\n');
}

main()
  .catch((e) => {
    console.error('❌ 生成失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
