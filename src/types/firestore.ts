// Firestore 데이터베이스 타입 정의

import { Timestamp } from 'firebase/firestore'

// 사용자 정보
export interface User {
  uid: string
  email: string
  name: string
  phoneNumber?: string
  profileImageUrl?: string
  role: 'user' | 'admin'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 주문 정보
export interface Order {
  id: string
  userId: string
  userEmail: string
  userName: string
  productId: string
  productName: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  paymentKey: string
  orderId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 리뷰 정보
export interface Review {
  id: string
  userId: string
  userName: string
  userProfileImage?: string
  productId: string
  productName: string
  rating: number // 1-5
  content: string
  images?: string[] // Firebase Storage URLs
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 상품 정보 (Firestore용 - 기존 products.ts와 병행)
export interface ProductFirestore {
  id: string
  category: string
  name: string
  description: string
  fullDescription: string
  duration: string
  level: string
  price: number // 숫자로 저장
  priceDisplay: string // 표시용 문자열
  image: string
  curriculum: string[]
  features: string[]
  targetAudience: string[]
  reviewCount: number
  averageRating: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Firestore 컬렉션 이름
export const COLLECTIONS = {
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  PRODUCTS: 'products',
} as const
