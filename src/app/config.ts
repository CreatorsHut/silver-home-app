// Next.js 15 SSR 관련 구성 설정

// 클라이언트 컴포넌트에서 사용할 수 있는 유틸리티 함수
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

// localStorage 접근 래퍼 함수
export const getLocalStorage = (key: string, defaultValue: any = null) => {
  if (isClient) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  }
  return defaultValue;
};

export const setLocalStorage = (key: string, value: any) => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key: string) => {
  if (isClient) {
    localStorage.removeItem(key);
  }
};

// SSR 동작 제어를 위한 설정
export const config = {
  // 정적 생성 비활성화 (항상 동적으로 페이지 렌더링)
  dynamic: 'force-dynamic',
  // 동적 API 라우팅
  dynamicParams: true,
};

// 모든 클라이언트 컴포넌트에서 사용할 수 있는 viewport 설정
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// 모든 클라이언트 컴포넌트에서 사용할 수 있는 metadata 설정
export const metadata = {
  title: {
    default: '실버홈 - 고령자 생활 지원 플랫폼',
    template: '%s | 실버홈',
  },
  description: '입주 신청, 생활 도움 요청, 가족 소통, 건강관리 등 고령자를 위한 통합 서비스',
};
