'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import PageHeader from '@/components/layout/PageHeader';

const products = [
  {
    id: 'fullstack-web',
    category: '웹 개발',
    name: '풀스택 웹 개발 종합반',
    description: '프론트엔드부터 백엔드까지 전체 웹 개발 과정을 학습합니다. React, Node.js, 데이터베이스를 활용한 실전 프로젝트 진행.',
    duration: '16주',
    level: '중급',
    price: '2,400,000원',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  },
  {
    id: 'frontend',
    category: '웹 개발',
    name: '프론트엔드 집중 과정',
    description: 'HTML, CSS, JavaScript 기초부터 React를 활용한 현대적인 웹 UI 개발까지. 실무 프로젝트를 통한 포트폴리오 제작.',
    duration: '12주',
    level: '초급',
    price: '1,800,000원',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop',
  },
  {
    id: 'mobile-app',
    category: '앱 개발',
    name: '모바일 앱 개발 과정',
    description: 'React Native를 활용한 크로스 플랫폼 모바일 앱 개발. iOS와 Android 앱을 동시에 개발하는 방법을 학습합니다.',
    duration: '14주',
    level: '중급',
    price: '2,200,000원',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
  },
  {
    id: 'data-analysis',
    category: '데이터 분석',
    name: 'Python 데이터 분석',
    description: 'Python 기초부터 Pandas, NumPy를 활용한 데이터 분석 및 시각화. 실제 데이터를 활용한 프로젝트 수행.',
    duration: '10주',
    level: '초급',
    price: '1,600,000원',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  },
  {
    id: 'backend',
    category: '웹 개발',
    name: '백엔드 개발자 과정',
    description: 'Node.js와 데이터베이스를 활용한 서버 개발. REST API 설계 및 구현, 보안과 성능 최적화를 학습합니다.',
    duration: '14주',
    level: '중급',
    price: '2,000,000원',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
  },
  {
    id: 'enterprise',
    category: '기업 맞춤형',
    name: '기업 맞춤형 교육',
    description: '기업의 요구사항에 맞춘 맞춤형 개발자 양성 프로그램. 기술 스택과 교육 내용을 자유롭게 구성할 수 있습니다.',
    duration: '협의',
    level: '맞춤형',
    price: '문의',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  },
];

const categories = ['전체', '웹 개발', '앱 개발', '데이터 분석', '기업 맞춤형'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredProducts = selectedCategory === '전체'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[var(--color-dark)] text-white">
      <Header />

      <PageHeader
        title="교육 상품"
        description="비전공자를 위한 실전 중심 코딩 교육 과정"
        breadcrumbs={[
          { label: '홈', href: '/' },
          { label: '상품' }
        ]}
      />

      {/* Product Categories */}
      <section className="py-12 bg-[var(--color-gray-900)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[var(--color-blue-600)] text-white'
                    : 'bg-[var(--color-gray-800)] text-white hover:bg-[var(--color-gray-700)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg overflow-hidden hover:border-[var(--color-blue-600)] transition-colors"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-[var(--color-blue-600)] font-medium mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                  <p className="text-[var(--color-gray-400)] mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-[var(--color-gray-400)]">수강기간</div>
                      <div className="font-medium">{product.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-gray-400)]">난이도</div>
                      <div className="font-medium">{product.level}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-blue-600)] mb-4">
                    {product.price}
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="block w-full py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors text-center no-underline"
                  >
                    자세히 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Comparison Table */}
      <section className="py-16 lg:py-24 bg-[var(--color-gray-900)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">과정 비교</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg">
              <thead>
                <tr className="border-b border-[var(--color-gray-800)]">
                  <th className="px-6 py-4 text-left font-bold">과정명</th>
                  <th className="px-6 py-4 text-left font-bold">분야</th>
                  <th className="px-6 py-4 text-left font-bold">기간</th>
                  <th className="px-6 py-4 text-left font-bold">난이도</th>
                  <th className="px-6 py-4 text-left font-bold">가격</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`${
                      index !== products.length - 1 ? 'border-b border-[var(--color-gray-800)]' : ''
                    } hover:bg-[var(--color-gray-900)] transition-colors`}
                  >
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4 text-[var(--color-gray-400)]">{product.category}</td>
                    <td className="px-6 py-4 text-[var(--color-gray-400)]">{product.duration}</td>
                    <td className="px-6 py-4 text-[var(--color-gray-400)]">{product.level}</td>
                    <td className="px-6 py-4 font-bold text-[var(--color-blue-600)]">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-4">
            <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">비전공자도 수강할 수 있나요?</h3>
              <p className="text-[var(--color-gray-400)] leading-relaxed">
                네, 모든 과정은 비전공자를 대상으로 설계되었습니다.
                기초부터 체계적으로 학습할 수 있도록 구성되어 있으며,
                현업 개발자 강사가 개별 맞춤 지도를 제공합니다.
              </p>
            </div>
            <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">수강료 할부가 가능한가요?</h3>
              <p className="text-[var(--color-gray-400)] leading-relaxed">
                네, 카드 할부 및 교육비 대출 상담이 가능합니다.
                자세한 내용은 상담을 통해 안내드립니다.
              </p>
            </div>
            <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">수료 후 취업 지원이 있나요?</h3>
              <p className="text-[var(--color-gray-400)] leading-relaxed">
                수료 후 이력서 작성, 포트폴리오 피드백, 모의 면접,
                취업 정보 제공 등 체계적인 취업 지원 프로그램을 운영하고 있습니다.
              </p>
            </div>
            <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">온라인 수강이 가능한가요?</h3>
              <p className="text-[var(--color-gray-400)] leading-relaxed">
                온라인 과정도 운영하고 있습니다.
                실시간 화상 강의와 녹화 강의를 제공하며,
                온라인에서도 오프라인과 동일한 수준의 교육을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
