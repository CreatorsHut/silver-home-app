'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기
export const config = {
  dynamic: 'force-dynamic'
};
  
// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지


;

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaArrowLeft, FaHome, FaHandHoldingHeart, FaUsers, FaHospital, FaCalendarAlt, FaLeaf } from 'react-icons/fa';

export default function AboutPage() {
  const router = useRouter();
  const { user } = useAuth();

  // 헤더 섹션 컴포넌트
  const HeaderSection = () => (
    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16 px-6 md:py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">실버홈에 오신 것을 환영합니다</h1>
        <p className="text-xl md:text-2xl mb-8">
          노년의 삶에 편안함과 존엄성을 더하는 최고의 실버타운
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/apply" className="bg-white text-red-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
            입주 신청하기
          </Link>
          <Link href="/contact" className="bg-transparent border-2 border-white hover:bg-white/10 py-3 px-6 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );

  // 소개 섹션 컴포넌트
  const IntroSection = () => (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">실버홈의 비전</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            저희는 어르신들의 건강하고 풍요로운 노년을 위한 최적의 환경을 제공합니다.
            안전, 존중, 독립성을 핵심 가치로 삼아 최고의 서비스를 약속드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-600 text-4xl mb-4">
              <FaHandHoldingHeart />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">맞춤형 케어</h3>
            <p className="text-gray-600">
              개인별 맞춤 건강 관리와 생활 지원 서비스로 어르신의 필요에 최적화된 케어를 제공합니다.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-600 text-4xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">커뮤니티 중심</h3>
            <p className="text-gray-600">
              다양한 활동과 이벤트를 통해 어르신들 간의 교류를 촉진하고 소속감을 높입니다.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-600 text-4xl mb-4">
              <FaHospital />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">의료 지원</h3>
            <p className="text-gray-600">
              24시간 의료 지원 시스템과 정기적인 건강 체크로 어르신의 건강을 책임집니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 시설 소개 섹션
  const FacilitiesSection = () => (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">최상급 시설</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
          편안하고 안전한 생활을 위한 다양한 시설을 갖추고 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <FaLeaf className="text-red-600" /> 쾌적한 주거 공간
            </h3>
            <p className="text-gray-600 mb-4">
              넓고 밝은 개인 주거 공간과 현대적인 설비를 갖춘 안전한 환경에서 생활하실 수 있습니다.
            </p>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                주거 공간 이미지
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-600 pl-2">
              <li>배리어 프리 설계로 이동이 편리합니다</li>
              <li>24시간 긴급 호출 시스템</li>
              <li>개인 맞춤형 인테리어 가능</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <FaCalendarAlt className="text-red-600" /> 다양한 커뮤니티 시설
            </h3>
            <p className="text-gray-600 mb-4">
              다양한 취미와 활동을 즐길 수 있는 커뮤니티 시설을 이용할 수 있습니다.
            </p>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                커뮤니티 시설 이미지
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-600 pl-2">
              <li>도서관 및 독서 공간</li>
              <li>헬스장 및 수영장</li>
              <li>영화관 및 다목적 홀</li>
              <li>정원 및 산책로</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // 입주 플랜 섹션
  const PricingSection = () => (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">입주 플랜</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
          다양한 니즈에 맞는 맞춤형 입주 플랜을 제공합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gray-100 p-6 text-center border-b">
              <h3 className="text-2xl font-bold text-gray-800">스탠다드</h3>
              <p className="text-gray-600 mt-2">기본 주거 및 케어 서비스</p>
              <div className="text-3xl font-bold text-red-600 my-4">월 200만원~</div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>1인실 주거 공간</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>일 3식 식사 제공</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>주간 건강 체크</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>기본 생활 지원 서비스</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>커뮤니티 활동 참여</span>
                </li>
              </ul>
              <Link href="/apply" className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-md mt-6 transition-colors">
                자세히 알아보기
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border-red-200">
            <div className="bg-red-50 p-6 text-center border-b border-red-200 relative">
              <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-bl">인기</div>
              <h3 className="text-2xl font-bold text-gray-800">프리미엄</h3>
              <p className="text-gray-600 mt-2">고급 주거 및 맞춤형 케어</p>
              <div className="text-3xl font-bold text-red-600 my-4">월 300만원~</div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>넓은 1인실 또는 2인실 선택</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>맞춤형 식단 제공</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>주 2회 의료진 방문</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>24시간 개인 케어 서비스</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>모든 시설 우선 이용권</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>가족 방문 시 전용 공간 제공</span>
                </li>
              </ul>
              <Link href="/apply" className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-md mt-6 transition-colors">
                자세히 알아보기
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gray-100 p-6 text-center border-b">
              <h3 className="text-2xl font-bold text-gray-800">디럭스</h3>
              <p className="text-gray-600 mt-2">최고급 주거 및 종합 케어</p>
              <div className="text-3xl font-bold text-red-600 my-4">월 400만원~</div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>럭셔리 스위트룸</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>전문 셰프의 맞춤 식사</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>매일 의료진 방문</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>24시간 전담 케어 매니저</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>개인 맞춤형 활동 프로그램</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>개인 차량 및 운전기사 서비스</span>
                </li>
              </ul>
              <Link href="/apply" className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-md mt-6 transition-colors">
                자세히 알아보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // CTA 섹션
  const CTASection = () => (
    <div className="bg-red-600 text-white py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">실버홈과 함께 편안한 노년을 시작하세요</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          더 많은 정보가 필요하시거나 직접 방문을 원하신다면 언제든지 연락주세요.
          친절한 상담원이 도와드리겠습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apply" className="bg-white text-red-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
            입주 신청하기
          </Link>
          <Link href="/contact" className="bg-transparent border-2 border-white hover:bg-white/10 py-3 px-8 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-red-600 hover:text-red-800 font-medium">
              <FaArrowLeft className="mr-2" /> 홈으로 돌아가기
            </Link>
            {!user && (
              <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main>
        <HeaderSection />
        <IntroSection />
        <FacilitiesSection />
        <PricingSection />
        <CTASection />
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">실버홈</h3>
              <p className="text-gray-400">
                최고의 실버타운 서비스를 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">바로가기</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">소개</Link></li>
                <li><Link href="/facilities" className="text-gray-400 hover:text-white">시설 안내</Link></li>
                <li><Link href="/schedule" className="text-gray-400 hover:text-white">일정 및 이벤트</Link></li>
                <li><Link href="/apply" className="text-gray-400 hover:text-white">입주 신청</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">지원</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">자주 묻는 질문</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">문의하기</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">이용약관</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">개인정보처리방침</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">연락처</h4>
              <p className="text-gray-400 mb-2">서울특별시 강남구 실버로 123</p>
              <p className="text-gray-400 mb-2">전화: 02-123-4567</p>
              <p className="text-gray-400">이메일: info@silverhome.kr</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 실버홈. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
