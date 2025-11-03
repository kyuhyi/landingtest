import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  WhereFilterOp,
  addDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  User,
  Order,
  Review,
  ProductFirestore,
  COLLECTIONS,
} from '@/types/firestore'

// ==================== 사용자 관리 ====================

export async function createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>) {
  console.log('🔵 createUser 호출됨:', userData)

  const now = Timestamp.now()
  const userDoc = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  }

  console.log('🔵 Firestore에 저장할 문서:', {
    collection: COLLECTIONS.USERS,
    docId: userData.uid,
    data: userDoc
  })

  try {
    await setDoc(doc(db, COLLECTIONS.USERS, userData.uid), userDoc)
    console.log('✅ createUser 성공')
    return userDoc
  } catch (error) {
    console.error('❌ createUser 실패:', error)
    throw error
  }
}

export async function getUser(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid))
  if (!userDoc.exists()) return null
  return userDoc.data() as User
}

export async function updateUser(uid: string, data: Partial<User>) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function getAllUsers(): Promise<User[]> {
  const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS))
  return usersSnapshot.docs.map(doc => doc.data() as User)
}

// ==================== 주문 관리 ====================

export async function createOrder(orderData: Omit<Order, 'createdAt' | 'updatedAt'>) {
  console.log('🔵 createOrder 호출됨:', orderData)

  const now = Timestamp.now()
  const orderDoc = {
    ...orderData,
    createdAt: now,
    updatedAt: now,
  }

  console.log('🔵 Firestore에 저장할 주문 문서:', {
    collection: COLLECTIONS.ORDERS,
    docId: orderData.id,
    data: orderDoc
  })

  try {
    await setDoc(doc(db, COLLECTIONS.ORDERS, orderData.id), orderDoc)
    console.log('✅ createOrder 성공 - 문서 ID:', orderData.id)
    return orderDoc
  } catch (error) {
    console.error('❌ createOrder 실패:', error)
    throw error
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const orderDoc = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId))
  if (!orderDoc.exists()) return null
  return orderDoc.data() as Order
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const ordersSnapshot = await getDocs(q)
  return ordersSnapshot.docs.map(doc => doc.data() as Order)
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    orderBy('createdAt', 'desc')
  )

  const ordersSnapshot = await getDocs(q)
  return ordersSnapshot.docs.map(doc => doc.data() as Order)
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
) {
  await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
    status,
    updatedAt: Timestamp.now(),
  })
}

// ==================== 리뷰 관리 ====================

export async function createReview(
  reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Review> {
  const now = Timestamp.now()
  const reviewDoc = {
    ...reviewData,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), reviewDoc)

  return {
    id: docRef.id,
    ...reviewDoc,
  }
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const q = query(
    collection(db, COLLECTIONS.REVIEWS),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  )

  const reviewsSnapshot = await getDocs(q)
  return reviewsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Review))
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const q = query(
    collection(db, COLLECTIONS.REVIEWS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const reviewsSnapshot = await getDocs(q)
  return reviewsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Review))
}

export async function updateReview(reviewId: string, data: Partial<Review>) {
  await updateDoc(doc(db, COLLECTIONS.REVIEWS, reviewId), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteReview(reviewId: string) {
  await deleteDoc(doc(db, COLLECTIONS.REVIEWS, reviewId))
}

// ==================== 상품 관리 (선택적 - 기존 products.ts 대체용) ====================

export async function syncProductToFirestore(product: ProductFirestore) {
  await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), {
    ...product,
    updatedAt: Timestamp.now(),
  })
}

export async function getProductFromFirestore(productId: string): Promise<ProductFirestore | null> {
  const productDoc = await getDoc(doc(db, COLLECTIONS.PRODUCTS, productId))
  if (!productDoc.exists()) return null
  return productDoc.data() as ProductFirestore
}

export async function updateProductReviewStats(
  productId: string,
  reviewCount: number,
  averageRating: number
) {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, productId), {
    reviewCount,
    averageRating,
    updatedAt: Timestamp.now(),
  })
}
