'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 간단한 유효성 검사
    if (!formData.name || !formData.email || !formData.message) {
      setError('이름, 이메일, 문의내용은 필수 입력 사항입니다.');
      return;
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    
    setIsSubmitting(true);
    
    // 실제 API 호출 대신 모의 제출 로직
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // 3초 후 성공 메시지 숨김
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }, 1000);
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

      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">문의하기</h1>
          <p className="text-xl max-w-3xl mx-auto">
            실버홈에 관심을 가져 주셔서 감사합니다. 궁금한 점이나 도움이 필요하신 사항이 있으면 언제든지 문의해 주세요.
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 문의 양식 */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">메시지 보내기</h2>
            
            {submitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
                <p className="font-bold">문의가 접수되었습니다!</p>
                <p>빠른 시일 내에 답변 드리겠습니다.</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">문의 주제</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">주제 선택</option>
                  <option value="입주 문의">입주 문의</option>
                  <option value="시설 이용">시설 이용</option>
                  <option value="이벤트 및 프로그램">이벤트 및 프로그램</option>
                  <option value="비용 및 요금">비용 및 요금</option>
                  <option value="방문 예약">방문 예약</option>
                  <option value="기타 문의">기타 문의</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">문의내용 *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  required
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                    isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? '제출 중...' : '문의하기'}
                </button>
              </div>
            </form>
          </div>
          
          {/* 연락처 정보 */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">연락처 정보</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
                    <FaBuilding />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">실버홈 본사</h3>
                    <p className="mt-1 text-gray-600">노인분들을 위한 최고의 실버타운 서비스</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">주소</h3>
                    <p className="mt-1 text-gray-600">서울특별시 강남구 실버로 123</p>
                    <p className="mt-1 text-gray-600">우편번호: 06123</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
                    <FaPhone />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">전화</h3>
                    <p className="mt-1 text-gray-600">대표: 02-123-4567</p>
                    <p className="mt-1 text-gray-600">입주 상담: 02-123-4568</p>
                    <p className="mt-1 text-gray-600">고객 지원: 02-123-4569</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
                    <FaEnvelope />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">이메일</h3>
                    <p className="mt-1 text-gray-600">일반 문의: info@silverhome.kr</p>
                    <p className="mt-1 text-gray-600">입주 상담: admission@silverhome.kr</p>
                    <p className="mt-1 text-gray-600">고객 지원: support@silverhome.kr</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
                    <FaClock />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">운영 시간</h3>
                    <p className="mt-1 text-gray-600">월요일 - 금요일: 09:00 - 18:00</p>
                    <p className="mt-1 text-gray-600">토요일: 09:00 - 13:00</p>
                    <p className="mt-1 text-gray-600">일요일 및 공휴일: 휴무</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">방문 안내</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">
                  실버홈 방문을 원하시는 경우, 사전 예약을 통해 시설 투어와 상담을 진행해 드립니다.
                  방문 예약은 전화 또는 이메일로 가능합니다.
                </p>
                <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    지도 영역
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-12 px-6 mt-12">
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
