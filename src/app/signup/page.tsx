'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { register, loginWithGoogle, loginWithKakao } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showRequirements, setShowRequirements] = useState(false);

  const signupWithGoogle = async () => {
    if (!terms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Google 회원가입 시도');
      await loginWithGoogle();
      console.log('✅ Google 회원가입 완료! 홈으로 이동...');
      router.push('/');
    } catch (error: any) {
      console.error('❌ Google 회원가입 오류:', error);
      setError(error.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signupWithKakao = async () => {
    if (!terms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Kakao 회원가입 시도');
      await loginWithKakao();
      console.log('✅ Kakao 회원가입 완료! 홈으로 이동...');
      router.push('/');
    } catch (error: any) {
      console.error('❌ Kakao 회원가입 오류:', error);
      setError(error.message || 'Kakao 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) {
      setPasswordStrength(0);
      setShowRequirements(false);
      return;
    }

    setShowRequirements(true);

    const hasLength = pwd.length >= 6;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);

    let strength = 0;
    if (hasLength) strength++;
    if (hasUppercase) strength++;
    if (hasNumber) strength++;

    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!terms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    if (!name || !email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 회원가입 시도:', { name, email });
      await register(email, password, name);
      console.log('✅ 회원가입 완료! 홈으로 이동...');
      router.push('/');
    } catch (error: any) {
      console.error('❌ 회원가입 오류:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else if (error.code === 'auth/weak-password') {
        setError('비밀번호가 너무 약합니다. 최소 6자 이상 입력해주세요.');
      } else {
        setError('회원가입 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 relative overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(37,99,235,0.1)_0%,_transparent_70%)] animate-pulse"></div>

      <div className="max-w-[440px] w-full glassmorphism rounded-3xl p-12 shadow-2xl shadow-black/50 relative z-10">
        <div className="text-center mb-8">
          <Image
            src="/images/bsd-white.png"
            alt="BSD 바이브코딩"
            width={160}
            height={40}
            className="h-auto max-w-[160px] mx-auto"
          />
        </div>

        <h1 className="text-white text-3xl font-bold text-center mb-2">회원가입</h1>
        <p className="text-bsd-gray-300 text-[15px] text-center mb-8">
          BSD 바이브코딩과 함께 시작하세요
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm mb-5">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={signupWithGoogle}
            className="flex items-center justify-center gap-3 px-6 py-3.5 border border-white/20 rounded-xl bg-white/95 text-bsd-gray-900 text-[15px] font-medium cursor-pointer transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 시작하기
          </button>

          <button
            onClick={signupWithKakao}
            className="flex items-center justify-center gap-3 px-6 py-3.5 border border-[#FEE500] rounded-xl bg-[#FEE500] text-black text-[15px] font-medium cursor-pointer transition-all duration-300 hover:bg-[#FFEB3B] hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#000000" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
            </svg>
            카카오로 시작하기
          </button>
        </div>

        <div className="flex items-center my-8 text-bsd-gray-300 text-sm">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4">또는 이메일로 가입</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <form onSubmit={handleSignup}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-bsd-gray-300 text-sm font-medium mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] placeholder:text-white/40"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-bsd-gray-300 text-sm font-medium mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] placeholder:text-white/40"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-bsd-gray-300 text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] placeholder:text-white/40"
              required
              disabled={loading}
            />
            {passwordStrength > 0 && (
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === 1
                      ? 'w-1/3 bg-red-500'
                      : passwordStrength === 2
                      ? 'w-2/3 bg-yellow-500'
                      : 'w-full bg-green-500'
                  }`}
                ></div>
              </div>
            )}
            {showRequirements && (
              <div className="mt-2 text-xs text-bsd-gray-300">
                <div className={`flex items-center gap-1.5 mt-1 ${hasLength ? 'text-green-500' : ''}`}>
                  <span>✓</span> 최소 6자 이상
                </div>
                <div className={`flex items-center gap-1.5 mt-1 ${hasUppercase ? 'text-green-500' : ''}`}>
                  <span>✓</span> 대문자 포함 (권장)
                </div>
                <div className={`flex items-center gap-1.5 mt-1 ${hasNumber ? 'text-green-500' : ''}`}>
                  <span>✓</span> 숫자 포함 (권장)
                </div>
              </div>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block text-bsd-gray-300 text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] placeholder:text-white/40"
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-start gap-2 mb-6 text-bsd-gray-300 text-sm">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-[18px] h-[18px] mt-0.5 cursor-pointer flex-shrink-0"
              required
              disabled={loading}
            />
            <label htmlFor="terms" className="cursor-pointer">
              <a href="#" className="text-bsd-blue-500 no-underline transition-colors duration-300 hover:text-bsd-blue-600">
                이용약관
              </a>{' '}
              및{' '}
              <a href="#" className="text-bsd-blue-500 no-underline transition-colors duration-300 hover:text-bsd-blue-600">
                개인정보처리방침
              </a>
              에 동의합니다
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-4 bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-bsd-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-bsd-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="text-center mt-6 text-bsd-gray-300 text-sm">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-bsd-blue-500 no-underline font-semibold transition-colors duration-300 hover:text-bsd-blue-600">
            로그인
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-bsd-gray-300 no-underline text-sm transition-colors duration-300 hover:text-white">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
