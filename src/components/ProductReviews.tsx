'use client'

import { useState, useEffect } from 'react'
import { getProductReviews } from '@/lib/firestore-utils'
import { Review } from '@/types/firestore'
import { Star, User, Edit } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import ReviewWriteModal from './ReviewWriteModal'

interface ProductReviewsProps {
  productId: string
  productName: string
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { userProfile } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showWriteModal, setShowWriteModal] = useState(false)

  const fetchReviews = async () => {
    try {
      const productReviews = await getProductReviews(productId)
      setReviews(productReviews)
    } catch (error) {
      console.error('리뷰 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleReviewSuccess = () => {
    // 리뷰 작성 성공 후 목록 새로고침
    fetchReviews()
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate()
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <p className="text-center text-gray-400">리뷰를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      {/* Header with Write Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">수강생 리뷰</h2>
        {userProfile && (
          <button
            onClick={() => setShowWriteModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors"
          >
            <Edit className="w-5 h-5" />
            리뷰 작성
          </button>
        )}
      </div>

      {/* 리뷰 통계 */}
      {reviews.length > 0 && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 justify-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">{reviews.length}개의 리뷰</p>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length
                const percentage = (count / reviews.length) * 100

                return (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-400 w-3">{rating}</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {count}개
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">아직 작성된 리뷰가 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">
              첫 번째 리뷰를 작성해보세요!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-white/5 border border-white/10 rounded-xl"
            >
              {/* 리뷰 헤더 */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  {review.userProfileImage ? (
                    <img
                      src={review.userProfileImage}
                      alt={review.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">{review.userName}</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {review.content}
                  </p>

                  {/* 리뷰 이미지 */}
                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`review image ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Write Modal */}
      {showWriteModal && (
        <ReviewWriteModal
          productId={productId}
          productName={productName}
          onClose={() => setShowWriteModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  )
}
