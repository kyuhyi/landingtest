'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createReview } from '@/lib/firestore-utils'
import { getProductById } from '@/data/products'
import { Star, Upload, X } from 'lucide-react'
import Header from '@/components/Header'

function ReviewWriteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userProfile } = useAuth()

  const orderId = searchParams.get('orderId') || ''
  const productId = searchParams.get('productId') || ''

  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const product = getProductById(productId)

  useEffect(() => {
    if (!userProfile) {
      alert('로그인이 필요합니다.')
      router.push(`/login?redirect=/reviews/write?orderId=${orderId}&productId=${productId}`)
    }

    if (!product) {
      alert('상품을 찾을 수 없습니다.')
      router.push('/mypage/orders')
    }
  }, [userProfile, product, router, orderId, productId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 5) {
      alert('이미지는 최대 5개까지 업로드 가능합니다.')
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userProfile || !product) return

    if (content.length < 10) {
      alert('리뷰 내용을 10자 이상 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      // 이미지 업로드는 나중에 Firebase Storage로 구현
      // 지금은 이미지 URL 없이 저장

      await createReview({
        userId: userProfile.id,
        userName: userProfile.name,
        userProfileImage: userProfile.profileImageUrl,
        productId: product.id,
        productName: product.name,
        rating,
        content,
        images: [], // 추후 Firebase Storage URL 배열
      })

      alert('리뷰가 등록되었습니다!')
      router.push('/mypage/orders')
    } catch (error) {
      console.error('리뷰 등록 오류:', error)
      alert('리뷰 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return null
  }

  return (
    <main className="min-h-screen bg-[var(--color-dark)]">
      <Header />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-8">리뷰 작성</h1>

            {/* 상품 정보 */}
            <div className="mb-8 p-4 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
              <p className="text-[var(--color-gray-400)] text-sm">{product.category} · {product.duration}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 별점 */}
              <div>
                <label className="block text-white font-medium mb-3">
                  별점 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-[var(--color-gray-600)]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-white text-xl font-bold">{rating}.0</span>
                </div>
              </div>

              {/* 리뷰 내용 */}
              <div>
                <label className="block text-white font-medium mb-3">
                  리뷰 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg text-white focus:outline-none focus:border-[var(--color-blue-600)] transition-colors resize-none"
                  placeholder="강의에 대한 솔직한 후기를 남겨주세요. (최소 10자)"
                  disabled={loading}
                />
                <p className="mt-2 text-sm text-[var(--color-gray-500)]">
                  {content.length} / 최소 10자
                </p>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-white font-medium mb-3">
                  사진 첨부 (선택, 최대 5장)
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-8 bg-[var(--color-dark)] border-2 border-dashed border-[var(--color-gray-800)] rounded-lg cursor-pointer hover:border-[var(--color-blue-600)] transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-[var(--color-gray-500)] mx-auto mb-2" />
                      <p className="text-[var(--color-gray-400)]">
                        클릭하여 이미지 업로드
                      </p>
                      <p className="text-sm text-[var(--color-gray-600)] mt-1">
                        JPG, PNG (최대 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading || images.length >= 5}
                    />
                  </label>

                  {/* 이미지 미리보기 */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 bg-[var(--color-gray-700)] text-white rounded-lg font-medium hover:bg-[var(--color-gray-600)] transition-colors"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading || content.length < 10}
                  className="flex-1 py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '등록 중...' : '리뷰 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ReviewWritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewWriteForm />
    </Suspense>
  )
}
