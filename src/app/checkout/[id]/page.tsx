'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProductById } from '@/data/products'
import { useAuth } from '@/lib/auth-context'
import { requestPayment, generateOrderId } from '@/lib/toss-payments'
import { CreditCard, ShoppingCart, ArrowLeft, User, Mail } from 'lucide-react'

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { userProfile } = useAuth()
  const { id } = use(params)
  const [loading, setLoading] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const product = getProductById(id)

  useEffect(() => {
    if (!userProfile) {
      router.push(`/login?redirect=/checkout/${id}`)
      return
    }

    setCustomerName(userProfile.name || '')
    setCustomerEmail(userProfile.email || '')
  }, [userProfile, id, router])

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <Link href="/products" className="text-[var(--color-blue-600)] hover:underline">
            상품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  if (product.price === '문의') {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold mb-4">이 상품은 온라인 결제가 불가능합니다</h1>
          <p className="text-[var(--color-gray-400)] mb-6">
            가격은 협의를 통해 결정됩니다. 문의하기를 통해 연락주세요.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 bg-[var(--color-blue-600)] text-white rounded-lg hover:bg-[var(--color-blue-700)] transition-colors"
          >
            문의하기
          </Link>
        </div>
      </div>
    )
  }

  const priceNumber = parseInt(product.price.replace(/[^0-9]/g, ''))

  const handlePayment = async () => {
    if (!customerName || !customerEmail) {
      alert('이름과 이메일을 입력해주세요.')
      return
    }

    if (!agreedToTerms) {
      alert('결제 약관에 동의해주세요.')
      return
    }

    setLoading(true)

    try {
      const orderId = generateOrderId()

      await requestPayment({
        orderId,
        orderName: product.name,
        amount: priceNumber,
        customerName,
        customerEmail,
        productId: product.id,
      })
    } catch (error) {
      console.error('결제 오류:', error)
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href={`/products/${id}`}
          className="inline-flex items-center gap-2 text-[var(--color-gray-400)] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          상품 페이지로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold mb-8">결제하기</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 구매자 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                구매자 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gray-400)] mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-700)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-600)] focus:border-transparent text-white"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-gray-400)] mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-700)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-600)] focus:border-transparent text-white"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">약관 동의</h2>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-[var(--color-blue-600)] bg-[var(--color-dark)] border-[var(--color-gray-700)] rounded focus:ring-[var(--color-blue-600)]"
                  />
                  <span className="text-sm text-[var(--color-gray-300)]">
                    결제 진행 필수 동의 (전자금융거래 이용약관, 개인정보 수집 및 이용, 개인정보 제3자 제공)
                  </span>
                </label>

                <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-4 text-sm text-[var(--color-gray-400)]">
                  <p className="mb-2">• 전자금융거래 이용약관에 동의합니다.</p>
                  <p className="mb-2">• 개인정보 수집 및 이용에 동의합니다.</p>
                  <p>• 개인정보 제3자 제공에 동의합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                주문 요약
              </h2>

              <div className="space-y-4">
                <div className="pb-4 border-b border-[var(--color-gray-800)]">
                  <div className="text-sm text-[var(--color-gray-400)] mb-1">상품명</div>
                  <div className="font-medium">{product.name}</div>
                </div>

                <div className="pb-4 border-b border-[var(--color-gray-800)]">
                  <div className="text-sm text-[var(--color-gray-400)] mb-1">카테고리</div>
                  <div className="font-medium">{product.category}</div>
                </div>

                <div className="pb-4 border-b border-[var(--color-gray-800)]">
                  <div className="text-sm text-[var(--color-gray-400)] mb-1">수강 기간</div>
                  <div className="font-medium">{product.duration}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-gray-400)]">상품 금액</span>
                    <span>{product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-gray-400)]">VAT 포함</span>
                    <span className="text-[var(--color-gray-400)]">-</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-gray-800)]">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">총 결제 금액</span>
                    <span className="text-2xl font-bold text-[var(--color-blue-600)]">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !agreedToTerms}
                className="w-full mt-6 px-6 py-4 bg-[var(--color-blue-600)] text-white rounded-lg font-medium text-lg hover:bg-[var(--color-blue-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    처리 중...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    결제하기
                  </>
                )}
              </button>

              <p className="text-xs text-[var(--color-gray-500)] text-center mt-4">
                토스페이먼츠를 통해 안전하게 결제됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
