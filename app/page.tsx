import Link from 'next/link';
import { GraduationCap, Mic, BarChart, FileText, Globe, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">签证面试模拟系统</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          轻松通过签证面试
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          通过题库驱动的真实模拟面试，提升你的英语口语和应答能力。
          支持多种签证类型，多种口音，智能评分和详细反馈。
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register">
            <Button size="lg">立即开始</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          核心功能
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Mic className="w-12 h-12 text-primary-600" />}
            title="语音问答"
            description="真实语音播放问题，录音回答，自动转写识别"
          />
          <FeatureCard
            icon={<Globe className="w-12 h-12 text-primary-600" />}
            title="多口音支持"
            description="美式、英式、印度、澳洲等多种口音，模拟真实场景"
          />
          <FeatureCard
            icon={<BarChart className="w-12 h-12 text-primary-600" />}
            title="智能评分"
            description="AI 评分系统，从内容、语言、表现、风险四个维度打分"
          />
          <FeatureCard
            icon={<FileText className="w-12 h-12 text-primary-600" />}
            title="详细报告"
            description="生成详细反馈报告，包括优缺点、改进建议和参考答案"
          />
          <FeatureCard
            icon={<CheckCircle className="w-12 h-12 text-primary-600" />}
            title="题库驱动"
            description="500+ 真实面试题目，覆盖 F1、H1B、B1/B2 等多种签证类型"
          />
          <FeatureCard
            icon={<GraduationCap className="w-12 h-12 text-primary-600" />}
            title="历史追踪"
            description="记录所有练习历史，对比进步，持续提升"
          />
        </div>
      </section>

      {/* Visa Types Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            支持的签证类型
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <VisaTypeCard title="F1 学生签证" description="留学生签证面试" />
            <VisaTypeCard title="H1B 工作签证" description="专业工作签证面试" />
            <VisaTypeCard title="B1/B2 旅游签证" description="旅游商务签证面试" />
            <VisaTypeCard title="J1 交流签证" description="交流访问签证面试" />
            <VisaTypeCard title="L1 调动签证" description="公司内部调动签证" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          准备好开始练习了吗？
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          立即注册，开始你的第一次模拟面试
        </p>
        <Link href="/register">
          <Button size="lg">免费注册</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 签证面试模拟系统. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

function VisaTypeCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-primary-50 p-6 rounded-lg text-center hover:bg-primary-100 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

