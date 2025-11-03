'use client'

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import PageHeader from '@/components/layout/PageHeader';
import { products, getProductById } from '@/data/products';
import ProductReviews from '@/components/ProductReviews';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--color-dark)] text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-[var(--color-blue-600)] text-white rounded-lg hover:bg-[var(--color-blue-700)] transition-colors"
          >
            상품 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-dark)] text-white">
      <Header />

      <PageHeader
        title={product.name}
        description={product.category}
        breadcrumbs={[
          { label: '홈', href: '/' },
          { label: '상품', href: '/products' },
          { label: product.name }
        ]}
      />

      {/* Product Hero */}
      <section className="py-12 bg-[var(--color-gray-900)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="h-96 relative overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-[var(--color-blue-600)] font-medium mb-2">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
              <p className="text-xl text-[var(--color-gray-300)] mb-8 leading-relaxed">
                {product.fullDescription}
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-sm text-[var(--color-gray-400)] mb-1">수강기간</div>
                  <div className="text-lg font-bold">{product.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--color-gray-400)] mb-1">난이도</div>
                  <div className="text-lg font-bold">{product.level}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--color-gray-400)] mb-1">수강료</div>
                  <div className="text-lg font-bold text-[var(--color-blue-600)]">{product.price}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/#contact"
                  className="inline-block px-8 py-4 bg-[var(--color-gray-700)] text-white rounded-lg font-medium text-lg hover:bg-[var(--color-gray-600)] transition-colors"
                >
                  수강 신청 문의하기
                </Link>
                <button
                  onClick={() => {
                    if (!userProfile) {
                      router.push(`/login?redirect=/checkout/${id}`)
                    } else {
                      router.push(`/checkout/${id}`)
                    }
                  }}
                  className="px-8 py-4 bg-[var(--color-blue-600)] text-white rounded-lg font-medium text-lg hover:bg-[var(--color-blue-700)] transition-colors"
                >
                  결제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">커리큘럼</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.curriculum.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 hover:border-[var(--color-blue-600)] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-blue-600)] flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--color-gray-300)] leading-relaxed">{item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-[var(--color-gray-900)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">과정 특징</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-blue-600)] bg-opacity-20 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[var(--color-blue-600)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">추천 대상</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.targetAudience.map((audience, index) => (
              <div
                key={index}
                className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[var(--color-blue-600)] mt-1"></div>
                <p className="text-lg text-[var(--color-gray-300)]">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-gray-900)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl text-[var(--color-gray-300)] mb-8">
            비전공자를 위한 체계적인 코딩 교육으로 새로운 커리어를 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                if (!userProfile) {
                  router.push(`/login?redirect=/checkout/${id}`)
                } else {
                  router.push(`/checkout/${id}`)
                }
              }}
              className="px-8 py-4 bg-[var(--color-blue-600)] text-white rounded-lg font-medium text-lg hover:bg-[var(--color-blue-700)] transition-colors"
            >
              결제하기
            </button>
            <Link
              href="/#contact"
              className="px-8 py-4 bg-[var(--color-gray-700)] text-white rounded-lg font-medium text-lg hover:bg-[var(--color-gray-600)] transition-colors"
            >
              수강 신청 문의
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-transparent border-2 border-[var(--color-blue-600)] text-white rounded-lg font-medium text-lg hover:bg-[var(--color-blue-600)] hover:bg-opacity-10 transition-colors"
            >
              다른 상품 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
