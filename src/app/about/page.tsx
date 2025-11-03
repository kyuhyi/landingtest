import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import PageHeader from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: '회사소개 | BSD 바이브코딩',
  description: '2019년 설립된 BSD 바이브코딩은 비전공자를 위한 실전 중심 코딩 교육을 제공합니다.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-dark)] text-white">
      <Header />

      <PageHeader
        title="회사소개"
        description="비전공자를 위한 실전 중심 코딩 교육 전문 기업"
        breadcrumbs={[
          { label: '홈', href: '/' },
          { label: '회사소개' }
        ]}
      />

      {/* Company Overview */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">BSD 바이브코딩</h2>
              <p className="text-lg text-[var(--color-gray-400)] mb-6">
                BSD 바이브코딩은 2019년 설립 이후 비전공자를 대상으로 한 실전 중심의 코딩 교육을 제공하고 있습니다.
                단순한 이론 교육이 아닌, 실제 개발 현장에서 필요한 기술과 문제 해결 능력을 키우는 데 중점을 두고 있습니다.
              </p>
              <p className="text-lg text-[var(--color-gray-400)] mb-6">
                우리는 교육생 개개인의 수준과 목표에 맞춘 맞춤형 커리큘럼을 제공하며,
                현업 개발자 출신의 강사진이 실무 경험을 바탕으로 체계적인 교육을 진행합니다.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="text-3xl font-bold text-[var(--color-blue-600)]">2019</div>
                  <div className="text-sm text-[var(--color-gray-400)] mt-1">설립년도</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--color-blue-600)]">1,200+</div>
                  <div className="text-sm text-[var(--color-gray-400)] mt-1">수료생</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--color-blue-600)]">85%</div>
                  <div className="text-sm text-[var(--color-gray-400)] mt-1">취업률</div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg overflow-hidden">
              <Image
                src="/images/class.jpg"
                alt="BSD 바이브코딩 교육 현장"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-[var(--color-gray-900)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">미션과 비전</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-blue-600)]">미션</h3>
              <p className="text-lg text-[var(--color-gray-400)] leading-relaxed">
                누구나 코딩을 배우고 개발자로 성장할 수 있는 기회를 제공합니다.
                비전공자도 체계적인 교육과 지속적인 지원을 통해 개발 역량을 갖춘 전문가로 성장할 수 있도록 돕습니다.
              </p>
            </div>
            <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-blue-600)]">비전</h3>
              <p className="text-lg text-[var(--color-gray-400)] leading-relaxed">
                실전 중심 교육으로 개발 인재 양성의 새로운 기준을 제시하고,
                교육생이 현업에서 바로 활약할 수 있는 실무 능력을 갖추도록 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">핵심 가치</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-blue-600)] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">실전 중심</h3>
              <p className="text-[var(--color-gray-400)]">
                이론보다 실무에서 바로 활용 가능한 기술을 우선으로 교육합니다.
              </p>
            </div>
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-blue-600)] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">맞춤형 교육</h3>
              <p className="text-[var(--color-gray-400)]">
                개개인의 수준과 목표에 맞는 학습 과정을 제공합니다.
              </p>
            </div>
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-blue-600)] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">지속적 지원</h3>
              <p className="text-[var(--color-gray-400)]">
                수료 후에도 취업과 경력 개발을 위한 지원을 계속합니다.
              </p>
            </div>
            <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-blue-600)] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3">현업 전문가</h3>
              <p className="text-[var(--color-gray-400)]">
                실제 개발 현장 경험이 풍부한 강사진이 교육을 담당합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 lg:py-24 bg-[var(--color-gray-900)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">연혁</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-xl font-bold text-[var(--color-blue-600)]">2024</div>
                </div>
                <div className="flex-grow pb-8 border-l-2 border-[var(--color-gray-800)] pl-6">
                  <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">온라인 교육 플랫폼 오픈</h3>
                    <p className="text-[var(--color-gray-400)]">
                      전국 어디서나 수강 가능한 온라인 교육 서비스 시작
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-xl font-bold text-[var(--color-blue-600)]">2022</div>
                </div>
                <div className="flex-grow pb-8 border-l-2 border-[var(--color-gray-800)] pl-6">
                  <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">교육생 1,000명 돌파</h3>
                    <p className="text-[var(--color-gray-400)]">
                      누적 수료생 1,000명 달성 및 취업 지원 프로그램 강화
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-xl font-bold text-[var(--color-blue-600)]">2020</div>
                </div>
                <div className="flex-grow pb-8 border-l-2 border-[var(--color-gray-800)] pl-6">
                  <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">기업 맞춤형 교육 과정 런칭</h3>
                    <p className="text-[var(--color-gray-400)]">
                      기업별 요구사항에 맞춘 맞춤형 개발자 양성 프로그램 시작
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-xl font-bold text-[var(--color-blue-600)]">2019</div>
                </div>
                <div className="flex-grow pl-6">
                  <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">BSD 바이브코딩 설립</h3>
                    <p className="text-[var(--color-gray-400)]">
                      비전공자를 위한 실전 코딩 교육 기관으로 시작
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
