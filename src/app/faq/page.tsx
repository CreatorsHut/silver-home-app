'use client'

export const runtime = 'edge';
export const regions = ['icn1'];
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// FAQ 항목 인터페이스
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  // FAQ 데이터
  const faqs: FAQItem[] = [
    {
      question: "실버홈에 입주하려면 어떤 절차가 필요한가요?",
      answer: "실버홈 입주는 온라인 신청, 상담 예약, 건강 상태 평가, 계약 체결의 단계로 진행됩니다. '입주 신청' 페이지를 통해 온라인으로 신청하시거나 연락처로 문의하시면 상세한 안내를 받으실 수 있습니다.",
      category: "입주 절차"
    },
    {
      question: "입주비용은 어떻게 되나요?",
      answer: "입주비용은 선택하신 플랜(스탠다드, 프리미엄, 디럭스)에 따라 월 200만원부터 400만원까지 다양합니다. 각 플랜별 상세 내용은 '입주 플랜' 페이지에서 확인하실 수 있으며, 추가 서비스 선택에 따라 비용이 달라질 수 있습니다.",
      category: "비용 및 결제"
    },
    {
      question: "입주자가 복용하는 약은 어떻게 관리되나요?",
      answer: "모든 입주자의 약은 전문 의료진에 의해 철저하게 관리됩니다. 복용 시간과 용량을 정확히 준수하며, 디지털 시스템을 통해 약 복용 현황을 기록하고 모니터링합니다. 가족분들께는 필요시 약 복용 현황 보고서를 제공해 드립니다.",
      category: "의료 및 건강 관리"
    },
    {
      question: "응급 상황 발생 시 어떻게 대응하나요?",
      answer: "실버홈은 24시간 응급 대응 체계를 갖추고 있습니다. 각 객실에는 응급 호출 버튼이 설치되어 있으며, 전담 의료진이 상주하여 즉각적인 대응이 가능합니다. 또한 인근 종합병원과의 협력 체계를 구축하여 신속한 이송 및 치료가 이루어집니다.",
      category: "의료 및 건강 관리"
    },
    {
      question: "가족이 입주자를 방문할 수 있는 시간이 정해져 있나요?",
      answer: "기본적으로 오전 9시부터 오후 8시까지 방문이 가능하며, 사전 예약을 통해 더 유연한 방문 시간 조정도 가능합니다. 프리미엄과 디럭스 플랜 이용자는 전용 가족 면회 공간을 이용하실 수 있습니다.",
      category: "방문 및 외출"
    },
    {
      question: "입주자가 외출이나 여행을 할 수 있나요?",
      answer: "물론입니다. 입주자의 자율성을 존중하며, 건강 상태가 허락하는 한 자유로운 외출이 가능합니다. 장기 외출이나 여행 시에는 안전을 위해 사전에 알려주시기 바랍니다. 필요시 동행 서비스도 제공해 드립니다.",
      category: "방문 및 외출"
    },
    {
      question: "식사는 어떻게 제공되나요?",
      answer: "전문 영양사가 설계한 건강식이 하루 3끼 제공됩니다. 입주자의 건강 상태, 기호, 종교적 요구 등을 고려한 맞춤형 식단 구성이 가능하며, 프리미엄 이상 플랜에서는 셰프의 특별 메뉴가 추가됩니다.",
      category: "시설 및 서비스"
    },
    {
      question: "인터넷과 TV는 이용 가능한가요?",
      answer: "모든 객실에 고속 와이파이와 스마트 TV가 기본 제공됩니다. 디지털 기기 사용에 어려움이 있으신 분들을 위한 지원 서비스도 마련되어 있습니다.",
      category: "시설 및 서비스"
    },
    {
      question: "계약 기간은 어떻게 되나요?",
      answer: "기본 계약 기간은 1년이며, 이후 갱신 또는 월 단위 계약으로 전환 가능합니다. 건강 상태 변화나 개인 사정으로 중도 해지가 필요할 경우, 1개월 전 통보를 원칙으로 하고 있습니다.",
      category: "계약 및 법적 사항"
    },
    {
      question: "환불 정책은 어떻게 되나요?",
      answer: "입주 후 2주 이내 퇴소 시 입주비의 80%를 환불해 드립니다. 이후에는 잔여 계약 기간에 따라 차등 환불되며, 자세한 사항은 계약서에 명시되어 있습니다.",
      category: "비용 및 결제"
    },
    {
      question: "입주자를 위한 활동 프로그램이 있나요?",
      answer: "다양한 여가, 교육, 운동 프로그램을 매일 운영하고 있습니다. 미술, 음악, 원예, 요가, 인지 훈련 등 입주자의 관심사와 건강 상태에 맞게 참여하실 수 있으며, 모든 활동은 전문 강사의 지도 하에 안전하게 진행됩니다.",
      category: "시설 및 서비스"
    },
    {
      question: "치매 환자도 입주할 수 있나요?",
      answer: "경증 치매 환자는 입주 가능하며, 전문적인 돌봄 서비스를 제공합니다. 중증 치매의 경우 전문 요양시설을 갖춘 협력 기관을 안내해 드리고 있습니다.",
      category: "입주 절차"
    }
  ];

  // 카테고리별 필터링을 위한 상태
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  // 아코디언 토글을 위한 상태
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  // 카테고리 목록 추출
  const categories = ['전체', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  // 카테고리별 FAQ 필터링
  const filteredFaqs = activeCategory === '전체' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  // 아코디언 토글 함수
  const toggleItem = (question: string) => {
    setOpenItems(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-red-600 hover:text-red-800 font-medium">
              <FaArrowLeft className="mr-2" /> 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">자주 묻는 질문</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실버홈에 관한 궁금증을 해결해 드립니다.
            아래에서 원하시는 정보를 찾을 수 없다면 언제든지 문의해 주세요.
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ 아코디언 목록 */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.question)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span>
                  {openItems[faq.question] ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </span>
              </button>
              {openItems[faq.question] && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                  <div className="mt-2 text-sm text-gray-500">카테고리: {faq.category}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 추가 문의 안내 */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">더 궁금한 점이 있으신가요?</p>
          <Link 
            href="/contact" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            문의하기
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 실버홈. 모든 권리 보유.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="text-gray-600 hover:text-red-600">이용약관</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-red-600">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
