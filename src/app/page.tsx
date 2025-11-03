import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-40 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-bsd-dark via-bsd-gray-900 to-bsd-dark">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-50"
          style={{
            background: 'radial-gradient(circle at 50% -50%, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block mb-6 px-5 py-2 bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-500 text-white rounded-full text-sm font-semibold tracking-wider">
            비전공자를 위한 AI 코딩 교육
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="block text-white">코딩 몰라도</span>
            <span className="block bg-gradient-to-r from-white via-bsd-gray-400 to-bsd-gray-400 bg-clip-text text-transparent">
              <span className="text-bsd-blue-500">24시간 안에</span>
            </span>
            <span className="block text-white">웹사이트 만드는 법</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-bsd-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            1만 명이 선택한 BSD 바이브코딩의 검증된 온라인 VOD 강의.
            <br />
            AI를 활용해 실전 프로젝트를 완성하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
            <a
              href="#lead-form"
              className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 rounded-xl text-white font-bold text-base sm:text-lg shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)] hover:-translate-y-1 no-underline text-center"
            >
              지금 무료로 시작하기 →
            </a>
            <a
              href="#curriculum"
              className="px-8 sm:px-12 py-4 sm:py-5 bg-transparent border-2 border-bsd-gray-700 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-300 hover:border-bsd-blue-600 hover:bg-bsd-blue-600/10 hover:-translate-y-1 no-underline text-center"
            >
              커리큘럼 보기
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-bsd-black border-t border-bsd-gray-900 border-b border-bsd-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <div className="text-center p-3 md:p-5">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-bsd-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-bsd-gray-400 text-base font-medium">수강생</div>
            </div>
            <div className="text-center p-3 md:p-5">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-bsd-blue-600 mb-2">
                24시간
              </div>
              <div className="text-bsd-gray-400 text-sm md:text-base font-medium">완성 시간</div>
            </div>
            <div className="text-center p-3 md:p-5">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-bsd-blue-600 mb-2">
                98%
              </div>
              <div className="text-bsd-gray-400 text-sm md:text-base font-medium">만족도</div>
            </div>
            <div className="text-center p-3 md:p-5">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-bsd-blue-600 mb-2">
                무제한
              </div>
              <div className="text-bsd-gray-400 text-sm md:text-base font-medium">평생 수강</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-gray-400 text-base md:text-lg font-semibold">
              💭 이런 고민 하셨나요?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              사업 아이디어는 있는데
              <br />
              기술이 발목을 잡나요?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="problem-card rounded-2xl p-6 md:p-10 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-bsd-blue-600/15">
              <div className="text-4xl md:text-5xl mb-4 md:mb-6">😫</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">개발자 구하기가 너무 어렵고 비싸요</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                프리랜서 개발자는 최소 300만원. 외주 업체는 1,000만원 이상. 소규모
                사업자에겐 너무 큰 부담입니다.
              </p>
            </div>
            <div className="problem-card rounded-2xl p-6 md:p-10 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-bsd-blue-600/15">
              <div className="text-4xl md:text-5xl mb-4 md:mb-6">⏰</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">빠르게 테스트하고 싶은데 시간이 너무 걸려요</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                아이디어를 검증하려면 빠른 실행이 중요한데, 개발 완료까지 몇 달씩
                기다려야 합니다.
              </p>
            </div>
            <div className="problem-card rounded-2xl p-6 md:p-10 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-bsd-blue-600/15">
              <div className="text-4xl md:text-5xl mb-4 md:mb-6">🤯</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">코딩을 배우려니 너무 어렵고 막막해요</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                유튜브와 책으로 독학하려 했지만 전문 용어와 복잡한 문법에 좌절했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-bsd-dark to-bsd-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-blue-500 text-base md:text-lg font-semibold">
              해결책
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 px-4">
              AI 바이브코딩으로
              <br />
              24시간 만에 웹사이트 완성
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-bsd-gray-400 max-w-3xl mx-auto px-4">
              어려운 코딩 문법 대신, AI에게 명령하는 방법을 배웁니다. 실전 프로젝트를
              만들며 자연스럽게 실력이 향상됩니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            <div className="feature-card rounded-2xl p-6 md:p-12 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-bsd-blue-600/20 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">AI 협업 스킬</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                Claude, ChatGPT를 활용한 실전 개발 방법론. 코딩 지식 없이도
                프로페셔널한 결과물을 만듭니다.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6 md:p-12 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-bsd-blue-600/20 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">빠른 실행력</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                이론 최소화, 실습 최대화. 강의를 듣자마자 바로 내 프로젝트에 적용
                가능합니다.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6 md:p-12 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-bsd-blue-600/20 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">비즈니스 중심 학습</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                랜딩페이지, 결제 시스템, 자동화 도구 등 실제 수익 창출에 필요한 것만
                배웁니다.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6 md:p-12 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-bsd-blue-600/20 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">반응형 웹 제작</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                PC, 태블릿, 모바일 모든 기기에서 완벽하게 동작하는 반응형 웹사이트를
                만듭니다.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6 md:p-12 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-bsd-blue-600/20 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">실전 통합 연동</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                Toss 결제, Google Forms, Zapier 자동화 등 실무에 필요한 서비스를 직접
                연동합니다.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-6 md:p-12 transition-all duration-300 hover:border-bsd-blue-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-bsd-blue-600/20 relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">평생 무제한 수강</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                한 번 결제로 평생 수강 가능. 업데이트되는 신규 강의도 무료로
                제공됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-bsd-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-gray-400 text-lg font-semibold">
              학습 프로세스
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              단 3단계로
              <br />
              웹사이트 제작자가 됩니다
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="step-card text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">AI 명령법 익히기</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                효과적으로 AI와 대화하는 프롬프트 작성법을 실전 예제로 학습합니다.
              </p>
            </div>
            <div className="step-card text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">실습으로 바로 적용</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                랜딩페이지, 결제 페이지 등을 직접 만들며 hands-on 경험을 쌓습니다.
              </p>
            </div>
            <div className="step-card text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">내 프로젝트 완성</h3>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                배운 내용을 활용해 실제 비즈니스에 활용 가능한 웹사이트를 완성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-24 px-6 bg-gradient-to-b from-bsd-gray-900 to-bsd-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-blue-500 text-lg font-semibold">
              커리큘럼
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              실전 중심의
              <br />
              체계적인 커리큘럼
            </h2>
            <p className="text-xl text-bsd-gray-400 max-w-3xl mx-auto">
              총 24시간 분량의 실습 중심 강의로 구성되어 있습니다.
            </p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                number: '01',
                title: 'AI 바이브코딩 시작하기',
                description: 'AI 도구 소개, Claude 사용법, 효과적인 프롬프트 작성 기초',
              },
              {
                number: '02',
                title: 'HTML/CSS 기초 (AI로 배우기)',
                description: '웹의 구조와 스타일링, AI를 활용한 레이아웃 구성',
              },
              {
                number: '03',
                title: '랜딩페이지 제작 실습',
                description: '전환율 높은 랜딩페이지 구조 설계 및 실제 제작',
              },
              {
                number: '04',
                title: '반응형 웹 디자인',
                description: '모바일, 태블릿, PC 모든 기기 대응 방법',
              },
              {
                number: '05',
                title: '결제 시스템 연동',
                description: 'Toss Payments, Stripe 등 실전 결제 시스템 구축',
              },
              {
                number: '06',
                title: '폼 및 데이터베이스 연동',
                description: 'Google Forms, Airtable을 활용한 리드 수집 시스템',
              },
              {
                number: '07',
                title: '배포 및 도메인 연결',
                description: 'Netlify, Vercel을 활용한 실제 서비스 런칭',
              },
              {
                number: '08',
                title: '비즈니스 자동화',
                description: 'Zapier, Make로 반복 작업 자동화 시스템 구축',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="curriculum-card rounded-2xl p-8 flex gap-6 items-start transition-all duration-300 hover:shadow-xl hover:shadow-bsd-blue-600/20"
              >
                <span className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-2xl font-bold">
                  {item.number}
                </span>
                <div>
                  <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                  <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-bsd-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-gray-400 text-lg font-semibold">
              수강생 후기
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              10,000명이 선택한
              <br />
              검증된 교육 프로그램
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                text: '"코딩 경험이 전혀 없었는데 3주 만에 제 브랜드 홈페이지를 직접 만들었어요. 외주 맡겼으면 최소 500만원은 들었을 텐데, 직접 만드니 뿌듯하고 수정도 자유롭게 할 수 있어요!"',
                name: '김지연',
                role: '브랜드 컨설턴트',
                initial: '김',
              },
              {
                text: '"40대 직장인인데도 따라하기 쉽게 설명해주셔서 좋았어요. 이제 회사 업무도 자동화하고, 부업으로 랜딩페이지 제작 서비스도 시작했습니다!"',
                name: '박민수',
                role: '마케팅 담당자',
                initial: '박',
              },
              {
                text: '"유튜브로 독학하다가 포기했었는데, 이 강의는 정말 체계적이고 실전 중심이라 좋았어요. 이제 클라이언트 요청에 바로바로 대응할 수 있어서 업무 효율이 3배 올랐습니다!"',
                name: '이서현',
                role: '프리랜서 디자이너',
                initial: '이',
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card rounded-2xl p-8">
                <p className="text-bsd-gray-300 mb-6 leading-relaxed text-lg italic">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 flex items-center justify-center text-xl font-bold">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h5 className="font-bold">{testimonial.name}</h5>
                    <p className="text-sm text-bsd-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-bsd-gray-900 to-bsd-dark">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-blue-500 text-lg font-semibold">
              자주 묻는 질문
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              궁금한 점이 있으신가요?
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                question: '정말 코딩 경험이 전혀 없어도 가능한가요?',
                answer:
                  '네, 가능합니다! 실제로 수강생의 80% 이상이 비전공자이며, 코딩 경험이 전혀 없는 분들도 성공적으로 웹사이트를 제작하고 계십니다. AI가 복잡한 코딩을 대신해주기 때문에, 여러분은 창의적인 아이디어와 비즈니스 로직에만 집중하시면 됩니다.',
              },
              {
                question: '강의는 어떤 형식인가요?',
                answer:
                  '온라인 VOD 형식으로 제공되며, 평생 무제한 수강이 가능합니다. 언제 어디서나 원하는 시간에 학습할 수 있으며, 실습 위주의 커리큘럼으로 구성되어 있습니다. 각 강의는 10-20분 분량으로 부담 없이 학습할 수 있습니다.',
              },
              {
                question: '완성까지 얼마나 걸리나요?',
                answer:
                  '개인차가 있지만, 하루 2-3시간씩 투자하면 1주일 내에 첫 웹사이트를 완성할 수 있습니다. 전체 커리큘럼은 약 24시간 분량이며, 본인의 속도에 맞춰 진행하시면 됩니다.',
              },
              {
                question: '추가 비용이 발생하나요?',
                answer:
                  '강의 수강료 외에는 추가 비용이 없습니다. 다만, 실제 웹사이트 운영을 위해서는 도메인 비용(연 1-2만원)과 호스팅 비용(월 0-1만원)이 별도로 필요할 수 있습니다. 강의에서는 무료 호스팅 방법도 함께 안내해드립니다.',
              },
              {
                question: '환불 정책은 어떻게 되나요?',
                answer:
                  '30일 무조건 환불 보장 정책을 운영하고 있습니다. 수강 후 만족하지 못하시면 이유를 묻지 않고 전액 환불해드립니다. 그만큼 교육 품질에 자신이 있습니다!',
              },
            ].map((faq, index) => (
              <div key={index} className="faq-card rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-bsd-blue-600 flex items-center justify-center font-bold text-lg">
                    Q
                  </span>
                  <h4 className="text-xl font-bold pt-1">{faq.question}</h4>
                </div>
                <p className="text-bsd-gray-400 leading-relaxed pl-14">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-24 px-6 bg-bsd-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block mb-4 text-bsd-blue-500 text-lg font-semibold">
              특별 혜택
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              지금 신청하면
              <br />
              첫 달 무료 체험
            </h2>
            <p className="text-xl text-bsd-gray-400 max-w-3xl mx-auto">
              선착순 100명 한정. 아래 정보를 입력하시면 무료 체험 안내를 보내드립니다.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="form-card rounded-3xl p-12">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-bsd-gray-300">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="홍길동"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-bsd-gray-600 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-bsd-gray-300">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@email.com"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-bsd-gray-600 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-bsd-gray-300">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="010-1234-5678"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-bsd-gray-600 focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goal" className="block text-sm font-semibold mb-2 text-bsd-gray-300">
                    만들고 싶은 것 *
                  </label>
                  <select
                    id="goal"
                    name="goal"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-bsd-blue-500 focus:bg-white/10 transition-all"
                    required
                  >
                    <option value="">선택해주세요</option>
                    <option value="landing">랜딩페이지</option>
                    <option value="ecommerce">쇼핑몰</option>
                    <option value="portfolio">포트폴리오 사이트</option>
                    <option value="blog">블로그/미디어</option>
                    <option value="saas">SaaS 제품</option>
                    <option value="etc">기타</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-10 py-5 bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 rounded-xl text-white font-bold text-lg shadow-lg shadow-bsd-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-bsd-blue-600/50 hover:-translate-y-1"
                >
                  무료 체험 신청하기 →
                </button>
                <p className="text-sm text-bsd-gray-400 text-center mt-4">
                  신청 후 24시간 내에 체험 안내를 보내드립니다.
                </p>
              </form>
              <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-white/10">
                <span className="text-bsd-gray-300 font-semibold">30일 무조건 환불 보장 정책</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-bsd-gray-900 to-bsd-dark text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block mb-6 px-6 py-3 bg-bsd-blue-600/20 text-bsd-blue-500 rounded-full text-sm font-bold">
            선착순 100명 한정 특별 혜택
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            더 이상 기술이
            <br />
            발목을 잡지 않도록
          </h2>
          <p className="text-xl text-bsd-gray-400 mb-12">
            오늘 시작하면 내일부터 웹사이트 제작자가 됩니다.
          </p>
          <a
            href="#lead-form"
            className="inline-block px-12 py-6 bg-gradient-to-r from-bsd-blue-600 to-bsd-blue-700 rounded-xl text-white font-bold text-xl shadow-lg shadow-bsd-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-bsd-blue-600/50 hover:-translate-y-1 no-underline"
          >
            지금 무료로 시작하기 →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-bsd-black border-t border-bsd-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-lg font-bold mb-4">BSD 바이브코딩</h4>
              <p className="text-sm md:text-base text-bsd-gray-400 leading-relaxed">
                비전공자를 위한
                <br />
                AI 바이브코딩 전문 교육센터
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">강의</h4>
              <div className="flex flex-col gap-2">
                <a href="#curriculum" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  커리큘럼
                </a>
                <a href="#social-proof" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  수강생 후기
                </a>
                <a href="#faq" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  자주 묻는 질문
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">문의</h4>
              <div className="flex flex-col gap-2">
                <a href="mailto:contact@bsdcoding.com" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  contact@bsdcoding.com
                </a>
                <a href="tel:0212345678" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  02-1234-5678
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">소셜 미디어</h4>
              <div className="flex flex-col gap-2">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  인스타그램
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  유튜브
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-bsd-gray-400 hover:text-bsd-blue-500 transition-colors">
                  네이버 블로그
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-bsd-gray-800 text-center">
            <p className="text-bsd-gray-400 text-sm">
              © 2025 BSD 바이브코딩 전문교육센터. All rights reserved.
            </p>
            <p className="text-bsd-gray-400 text-sm mt-2">
              <a href="#" className="hover:text-bsd-blue-500 transition-colors mx-3">
                개인정보처리방침
              </a>
              |
              <a href="#" className="hover:text-bsd-blue-500 transition-colors mx-3">
                이용약관
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </main>
  );
}
