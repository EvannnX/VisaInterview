'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { GraduationCap, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                签证面试模拟系统
              </span>
            </Link>

            {session && (
              <div className="ml-10 flex space-x-4">
                {isAdmin ? (
                  <>
                    <NavLink href="/admin" active={pathname === '/admin'}>
                      仪表盘
                    </NavLink>
                    <NavLink
                      href="/admin/questions"
                      active={pathname?.startsWith('/admin/questions')}
                    >
                      题库管理
                    </NavLink>
                    <NavLink
                      href="/admin/reports"
                      active={pathname?.startsWith('/admin/reports')}
                    >
                      成绩查看
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink href="/dashboard" active={pathname === '/dashboard'}>
                      我的面试
                    </NavLink>
                    <NavLink
                      href="/interview/new"
                      active={pathname === '/interview/new'}
                    >
                      开始新面试
                    </NavLink>
                    <NavLink
                      href="/reports"
                      active={pathname?.startsWith('/reports')}
                    >
                      我的报告
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span>{session.user.name}</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {isAdmin ? '管理员' : '学员'}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  <span>退出</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

