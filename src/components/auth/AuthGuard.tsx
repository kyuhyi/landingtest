'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !userProfile) {
      console.log('🔒 AuthGuard: 인증되지 않은 사용자, 로그인 페이지로 리다이렉트');
      router.push(redirectTo);
    }
  }, [userProfile, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bsd-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bsd-blue-500"></div>
          <p className="mt-4 text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  console.log('✅ AuthGuard: 인증된 사용자, 페이지 표시');
  return <>{children}</>;
}
