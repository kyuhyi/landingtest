'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const getNavigationItems = (isLoggedIn: boolean) => {
  const items = [
    { name: '홈', href: '/' },
    { name: '회사소개', href: '/about' },
    { name: '상품', href: '/products' }
  ];

  if (isLoggedIn) {
    items.push({ name: '내정보', href: '/mypage' });
  }

  return items;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, loading, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isLoggedIn = !!userProfile;

  // 로딩 중일 때는 아무것도 표시하지 않음
  if (loading) {
    return (
      <header className="glassmorphism sticky top-0 z-50 border-b border-white/10 shadow-lg shadow-black/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/bsd-white.png"
                alt="BSD 바이브코딩"
                width={160}
                height={40}
                className="h-auto w-auto max-w-[160px]"
                priority
              />
            </Link>
            <div className="text-white/50">로딩 중...</div>
          </div>
        </nav>
      </header>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserDropdown(false);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="glassmorphism sticky top-0 z-50 border-b border-white/10 shadow-lg shadow-black/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 relative">
        <div className="flex items-center w-full gap-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/bsd-white.png"
              alt="BSD 바이브코딩"
              width={160}
              height={40}
              className="h-auto w-auto max-w-[160px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 flex-1 justify-center items-center list-none">
            {getNavigationItems(isLoggedIn).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`no-underline font-medium text-[15px] transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-bsd-blue-500 after:transition-all after:duration-300 ${
                      isActive
                        ? 'text-bsd-blue-500 after:w-full'
                        : 'text-white hover:text-bsd-blue-500 after:w-0 hover:after:w-full'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => (window.location.href = '/login')}
                  className="bg-transparent border-none text-bsd-gray-300 px-4 py-2 font-medium text-[15px] cursor-pointer transition-colors duration-300 hover:text-white"
                >
                  로그인
                </button>
                <Link
                  href="/signup"
                  className="glass-button rounded-lg px-5 py-2.5 text-white font-medium text-[15px] no-underline transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  회원가입
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 glass-button rounded-lg px-4 py-2 text-white font-medium text-[15px] cursor-pointer transition-all duration-300 hover:bg-white/30"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                    {userProfile?.name?.[0] || 'U'}
                  </div>
                  <span className="hidden md:inline">{userProfile?.name || '사용자'}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/20 py-2 z-50">
                    <Link
                      href="/mypage/profile"
                      className="block px-4 py-2 text-gray-800 no-underline transition-colors duration-200 hover:bg-bsd-blue-50"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      내 정보
                    </Link>
                    <Link
                      href="/mypage/orders"
                      className="block px-4 py-2 text-gray-800 no-underline transition-colors duration-200 hover:bg-bsd-blue-50"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      주문내역
                    </Link>
                    <Link
                      href="/mypage/settings"
                      className="block px-4 py-2 text-gray-800 no-underline transition-colors duration-200 hover:bg-bsd-blue-50"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      설정
                    </Link>
                    <div className="h-px bg-black/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:bg-red-50"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4 ml-auto">
            {isLoggedIn && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                {userProfile?.name?.[0] || 'U'}
              </div>
            )}
            <button
              onClick={toggleMobileMenu}
              className="flex flex-col gap-1 bg-transparent border-none cursor-pointer p-2"
            >
              <span className="w-6 h-0.5 bg-white transition-all duration-300"></span>
              <span className="w-6 h-0.5 bg-white transition-all duration-300"></span>
              <span className="w-6 h-0.5 bg-white transition-all duration-300"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-bsd-dark/98 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4">
            {getNavigationItems(isLoggedIn).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`no-underline text-base py-3 border-b border-white/5 ${
                    isActive ? 'text-bsd-blue-500' : 'text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-white no-underline text-base py-3 border-b border-white/5"
                  onClick={() => setShowMobileMenu(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="glass-button rounded-lg text-center py-3 text-white no-underline mt-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  회원가입
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/mypage/profile"
                  className="text-white no-underline text-base py-3 border-b border-white/5"
                  onClick={() => setShowMobileMenu(false)}
                >
                  내 정보
                </Link>
                <Link
                  href="/mypage/orders"
                  className="text-white no-underline text-base py-3 border-b border-white/5"
                  onClick={() => setShowMobileMenu(false)}
                >
                  주문내역
                </Link>
                <Link
                  href="/mypage/settings"
                  className="text-white no-underline text-base py-3 border-b border-white/5"
                  onClick={() => setShowMobileMenu(false)}
                >
                  설정
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="text-left text-red-400 bg-transparent border-none text-base py-3 cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
