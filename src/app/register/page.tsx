'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import Header from '@/components/Header'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!formData.name || !formData.email || !formData.password) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    try {
      await register(formData.email, formData.password, formData.name)
      router.push('/')
    } catch (error: any) {
      console.error('회원가입 오류:', error)
      if (error.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.')
      } else if (error.code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.')
      } else if (error.code === 'auth/weak-password') {
        setError('비밀번호가 너무 약합니다.')
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-dark)]">
      <Header />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
            <p className="text-[var(--color-gray-400)] mb-8">
              BSD 바이브코딩에 오신 것을 환영합니다
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg text-white focus:outline-none focus:border-[var(--color-blue-600)] transition-colors"
                  placeholder="홍길동"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg text-white focus:outline-none focus:border-[var(--color-blue-600)] transition-colors"
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  비밀번호
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg text-white focus:outline-none focus:border-[var(--color-blue-600)] transition-colors"
                  placeholder="최소 6자 이상"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg text-white focus:outline-none focus:border-[var(--color-blue-600)] transition-colors"
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '회원가입'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[var(--color-gray-400)]">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/login"
                  className="text-[var(--color-blue-600)] hover:underline"
                >
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
