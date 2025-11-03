export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  image: string;
  fullDescription: string;
  curriculum: string[];
  features: string[];
  targetAudience: string[];
}

export const products: Product[] = [
  {
    id: 'fullstack-web',
    category: '웹 개발',
    name: '풀스택 웹 개발 종합반',
    description: '프론트엔드부터 백엔드까지 전체 웹 개발 과정을 학습합니다. React, Node.js, 데이터베이스를 활용한 실전 프로젝트 진행.',
    duration: '16주',
    level: '중급',
    price: '2,400,000원',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    fullDescription: '프론트엔드부터 백엔드까지 웹 개발의 전 과정을 체계적으로 학습하는 종합 과정입니다. React를 활용한 현대적인 프론트엔드 개발부터 Node.js 기반의 서버 개발, 데이터베이스 설계 및 관리까지 실무에 필요한 모든 기술을 습득할 수 있습니다.',
    curriculum: [
      'HTML/CSS 기초 및 반응형 디자인',
      'JavaScript ES6+ 문법 및 활용',
      'React 라이브러리를 활용한 SPA 개발',
      'Node.js 서버 개발 기초',
      'Express.js를 활용한 REST API 개발',
      'MongoDB/PostgreSQL 데이터베이스 설계',
      '인증 및 보안 구현',
      '배포 및 서버 운영'
    ],
    features: [
      '실전 프로젝트 3개 이상 완성',
      '1:1 멘토링 제공',
      '평생 수강 가능',
      '취업 지원 프로그램',
      '수료증 발급'
    ],
    targetAudience: [
      '웹 개발 전반을 학습하고 싶은 분',
      '프론트엔드와 백엔드를 모두 다루고 싶은 분',
      '풀스택 개발자로 취업을 준비하는 분',
      '실무 프로젝트 경험을 쌓고 싶은 분'
    ]
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
    fullDescription: '웹 프론트엔드 개발에 필요한 핵심 기술을 집중적으로 학습합니다. HTML, CSS 기초부터 시작하여 JavaScript, React까지 단계별로 학습하며, 실전 프로젝트를 통해 포트폴리오를 완성합니다.',
    curriculum: [
      'HTML5 시맨틱 태그 및 구조',
      'CSS3 스타일링 및 애니메이션',
      'Flexbox, Grid 레이아웃',
      'JavaScript 기초 및 DOM 조작',
      'ES6+ 최신 문법',
      'React 컴포넌트 및 Hooks',
      '상태 관리 (Redux/Context API)',
      '반응형 웹 디자인'
    ],
    features: [
      '프론트엔드 실전 프로젝트 5개',
      '포트폴리오 웹사이트 제작',
      '코드 리뷰 제공',
      '평생 수강 가능',
      '수료증 발급'
    ],
    targetAudience: [
      'HTML/CSS 기초부터 배우고 싶은 분',
      'React를 활용한 현대적인 웹 개발을 배우고 싶은 분',
      '프론트엔드 개발자로 취업을 준비하는 분',
      '포트폴리오를 제작하고 싶은 분'
    ]
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
    fullDescription: 'React Native를 활용하여 iOS와 Android 앱을 동시에 개발하는 방법을 학습합니다. 하나의 코드베이스로 두 플랫폼의 앱을 개발할 수 있어 효율적인 앱 개발이 가능합니다.',
    curriculum: [
      'React Native 기초',
      '컴포넌트 및 스타일링',
      '네비게이션 구현',
      '상태 관리',
      'API 연동',
      '네이티브 모듈 활용',
      '앱 배포 (iOS/Android)',
      '성능 최적화'
    ],
    features: [
      '실전 앱 프로젝트 3개',
      'iOS/Android 배포 경험',
      '1:1 멘토링',
      '평생 수강 가능',
      '수료증 발급'
    ],
    targetAudience: [
      '모바일 앱 개발을 배우고 싶은 분',
      'React Native로 크로스 플랫폼 개발을 하고 싶은 분',
      '앱 개발자로 취업을 준비하는 분',
      '웹 개발 경험이 있는 분'
    ]
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
    fullDescription: 'Python 프로그래밍 기초부터 시작하여 데이터 분석에 필요한 Pandas, NumPy, Matplotlib 등의 라이브러리를 활용한 실전 데이터 분석 방법을 학습합니다.',
    curriculum: [
      'Python 기초 문법',
      'NumPy 배열 연산',
      'Pandas 데이터프레임',
      '데이터 전처리 및 정제',
      '탐색적 데이터 분석 (EDA)',
      'Matplotlib/Seaborn 시각화',
      '통계 분석 기초',
      '실전 데이터 분석 프로젝트'
    ],
    features: [
      '실제 데이터셋을 활용한 프로젝트',
      '데이터 분석 포트폴리오 제작',
      '1:1 멘토링',
      '평생 수강 가능',
      '수료증 발급'
    ],
    targetAudience: [
      'Python 프로그래밍을 처음 시작하는 분',
      '데이터 분석 업무를 수행하고 싶은 분',
      '데이터 기반 의사결정을 하고 싶은 분',
      '데이터 분석가로 커리어를 시작하고 싶은 분'
    ]
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
    fullDescription: 'Node.js를 활용한 서버 개발부터 데이터베이스 설계, REST API 구현, 보안 및 성능 최적화까지 백엔드 개발의 전 과정을 학습합니다.',
    curriculum: [
      'Node.js 기초',
      'Express.js 프레임워크',
      'REST API 설계 및 구현',
      'MongoDB/PostgreSQL',
      'ORM (Sequelize/Mongoose)',
      '인증 및 권한 관리',
      '보안 및 에러 처리',
      '성능 최적화 및 배포'
    ],
    features: [
      'API 서버 개발 프로젝트',
      '실전 배포 경험',
      '1:1 멘토링',
      '평생 수강 가능',
      '수료증 발급'
    ],
    targetAudience: [
      '백엔드 개발을 배우고 싶은 분',
      'API 서버를 개발하고 싶은 분',
      '백엔드 개발자로 취업을 준비하는 분',
      'JavaScript에 익숙한 분'
    ]
  },
  {
    id: 'enterprise',
    category: '기업 맞춤형',
    name: '기업 맞춤형 교육',
    description: '기업의 요구사항에 맞춘 맞춤형 개발자 양성 프로그램. 기술 스택과 교육 내용을 자유롭게 구성할 수 있습니다.',
    duration: '협의',
    level: '맞춤형',
    price: '100원',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    fullDescription: '기업의 특정 요구사항과 기술 스택에 맞춘 맞춤형 교육 프로그램을 제공합니다. 교육 내용, 기간, 난이도 등을 자유롭게 조정할 수 있습니다.',
    curriculum: [
      '기업별 맞춤 커리큘럼 설계',
      '실무 프로젝트 기반 교육',
      '기술 스택 맞춤 교육',
      '팀 협업 및 코드 리뷰',
      '사내 개발 문화 구축 지원'
    ],
    features: [
      '기업 맞춤형 커리큘럼',
      '현장 방문 교육 가능',
      '실무 프로젝트 지원',
      '지속적인 기술 지원',
      '교육 결과 리포트 제공'
    ],
    targetAudience: [
      '개발자 양성이 필요한 기업',
      '기술 스택 전환이 필요한 팀',
      '신입 개발자 온보딩이 필요한 기업',
      '개발 문화 개선이 필요한 조직'
    ]
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}
