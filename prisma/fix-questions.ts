import { PrismaClient, VisaType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('清理现有题目...');
  await prisma.question.deleteMany({});
  
  console.log('重新运行原始种子数据...');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
