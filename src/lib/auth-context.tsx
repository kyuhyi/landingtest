'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './firebase'
import { createUser, getUser } from './firestore-utils'
import { User } from '@/types/firestore'

interface UserProfile {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  phoneNumber?: string
  profileImageUrl?: string
}

interface AuthContextType {
  userProfile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithKakao: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔵 AuthProvider useEffect 시작 - onAuthStateChanged 리스너 설정')

    // Firebase Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔵 onAuthStateChanged 트리거됨:', firebaseUser ? `로그인됨 (${firebaseUser.uid})` : '로그아웃됨')

      if (firebaseUser) {
        console.log('📥 Firestore에서 사용자 프로필 가져오기 시작:', firebaseUser.uid)
        // Firestore에서 사용자 프로필 가져오기
        const userDoc = await getUser(firebaseUser.uid)
        console.log('📥 Firestore 프로필 조회 결과:', userDoc)

        if (userDoc) {
          const profile = {
            id: userDoc.uid,
            name: userDoc.name,
            email: userDoc.email,
            role: userDoc.role,
            phoneNumber: userDoc.phoneNumber,
            profileImageUrl: userDoc.profileImageUrl,
          }
          console.log('✅ userProfile 상태 업데이트:', profile)
          setUserProfile(profile)
        } else {
          console.log('⚠️ Firestore에 사용자 프로필 없음')
          setUserProfile(null)
        }
      } else {
        console.log('❌ 사용자 로그아웃 상태')
        setUserProfile(null)
      }
      console.log('✅ loading 상태를 false로 변경')
      setLoading(false)
    })

    return () => {
      console.log('🔵 AuthProvider cleanup - onAuthStateChanged 리스너 해제')
      unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
    // onAuthStateChanged에서 자동으로 userProfile 설정됨
  }

  const register = async (email: string, password: string, name: string) => {
    console.log('🔥 회원가입 시작:', { email, name })

    try {
      // Firebase Authentication에 사용자 등록
      console.log('📝 Firebase Auth 계정 생성 중...')
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      console.log('✅ Firebase Auth 계정 생성 성공:', firebaseUser.uid)

      // Firestore에 사용자 프로필 저장
      console.log('💾 Firestore에 사용자 프로필 저장 중...')
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        role: 'user' as const,
      }
      console.log('📤 저장할 데이터:', userData)

      await createUser(userData)
      console.log('✅ Firestore 사용자 프로필 저장 성공')

      // 프로필 즉시 로드
      const userDoc = await getUser(firebaseUser.uid)
      console.log('📥 저장된 프로필 조회:', userDoc)

    } catch (error) {
      console.error('❌ 회원가입 오류:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    console.log('🔥 Google 소셜 로그인 시작')

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      console.log('📝 Google 팝업 열기...')
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      console.log('✅ Google 로그인 성공:', firebaseUser.uid)

      // Firestore에 사용자 프로필 확인 및 생성
      let userDoc = await getUser(firebaseUser.uid)

      if (!userDoc) {
        console.log('💾 새 사용자 - Firestore에 프로필 생성 중...')
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          role: 'user' as const,
          profileImageUrl: firebaseUser.photoURL || undefined,
        }
        await createUser(userData)
        console.log('✅ Google 사용자 프로필 저장 완료')
      } else {
        console.log('✅ 기존 사용자 로그인 완료')
      }
    } catch (error: any) {
      console.error('❌ Google 로그인 오류:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('로그인 팝업이 닫혔습니다.')
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('로그인이 취소되었습니다.')
      }
      throw error
    }
  }

  const loginWithKakao = async () => {
    console.log('🔥 Kakao 소셜 로그인 시작 (JavaScript SDK)')

    try {
      // Kakao SDK 로딩 대기
      if (typeof window === 'undefined') {
        throw new Error('브라우저 환경이 아닙니다.')
      }

      // SDK가 로드될 때까지 최대 5초 대기
      let attempts = 0
      while (!(window as any).Kakao && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }

      if (!(window as any).Kakao) {
        throw new Error('카카오 SDK 로딩에 실패했습니다. 페이지를 새로고침해주세요.')
      }

      const Kakao = (window as any).Kakao

      // SDK 초기화 (한 번만 실행)
      if (!Kakao.isInitialized()) {
        const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
        if (!jsKey) {
          throw new Error('NEXT_PUBLIC_KAKAO_JS_KEY 환경변수가 설정되지 않았습니다.')
        }
        Kakao.init(jsKey)
        console.log('✅ Kakao SDK 초기화 완료')
      }

      console.log('📝 Kakao 로그인 팝업 열기...')

      // 카카오 로그인 팝업
      await new Promise((resolve, reject) => {
        Kakao.Auth.login({
          success: async (authObj: any) => {
            console.log('✅ 카카오 인증 성공:', authObj)

            try {
              // 카카오 사용자 정보 가져오기
              Kakao.API.request({
                url: '/v2/user/me',
                success: async (res: any) => {
                  console.log('📥 카카오 사용자 정보:', res)

                  const kakaoAccount = res.kakao_account
                  const profile = kakaoAccount.profile
                  const email = kakaoAccount.email
                  const name = profile.nickname || email?.split('@')[0] || '사용자'
                  const profileImageUrl = profile.profile_image_url

                  // Firebase Custom Token 발급을 위해 서버 API 호출
                  const response = await fetch('/api/auth/kakao', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      kakaoUserId: res.id,
                      email,
                      name,
                      profileImageUrl,
                    }),
                  })

                  if (!response.ok) {
                    throw new Error('Firebase 인증 실패')
                  }

                  const { customToken } = await response.json()

                  // Custom Token으로 Firebase 로그인
                  const { signInWithCustomToken } = await import('firebase/auth')
                  const firebaseUser = await signInWithCustomToken(auth, customToken)
                  console.log('✅ Firebase 로그인 성공:', firebaseUser.user.uid)

                  resolve(firebaseUser)
                },
                fail: (error: any) => {
                  console.error('❌ 카카오 사용자 정보 조회 실패:', error)
                  reject(error)
                },
              })
            } catch (error) {
              console.error('❌ Firebase 인증 오류:', error)
              reject(error)
            }
          },
          fail: (err: any) => {
            console.error('❌ 카카오 로그인 실패:', err)
            reject(new Error('카카오 로그인이 취소되었습니다.'))
          },
        })
      })
    } catch (error: any) {
      console.error('❌ Kakao 로그인 오류:', error)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider value={{ userProfile, loading, login, register, loginWithGoogle, loginWithKakao, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
