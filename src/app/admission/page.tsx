'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { FaArrowLeft, FaHome, FaPhone, FaUser, FaIdCard, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

function AdmissionContent() {
  const { user } = useAuth();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone : '',
    birthdate: '',
    idNumber: '',
    address: user ? user.address || '' : '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    healthCondition: '',
    medicalHistory: '',
    specialRequirements: '',
    preferredDate: '',
    additionalNotes: '',
  });

  useEffect(() => {
    // 이미 로그인한 입주자는 대시보드로 리다이렉트
    if (typeof window !== 'undefined' && user && user.role === 'resident') {
      window.location.href = '/dashboard';
    }
    
    // 로그인한 사용자는 이름과 연락처를 자동으로 채움
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 데이터 검증
    if (!formData.name || !formData.phone || !formData.emergencyContact || !formData.emergencyPhone || !formData.emergencyRelationship) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 폼 데이터 초기화
      if (typeof window !== 'undefined' && user) {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const data = JSON.parse(storedData);
          
          // 입주 신청 데이터 생성
          const applicationData = {
            id: `app-${Date.now()}`,
            ...formData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: user ? user.id : null,
            specialRequirements: formData.specialRequirements || ''
          };
          
          // 신청 데이터 추가
          data.applications = [...(data.applications || []), applicationData];
          
          // 업데이트된 데이터 저장
          localStorage.setItem('silverHomeData', JSON.stringify(data));
          
          // 성공 상태로 변경
          setIsSubmitting(false);
          setIsSubmitted(true);
        }
        
        // 폼 제출 완료 후 대시보드로 이동
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }, 3000);
      }
    } catch (err) {
      console.error('신청서 제출 오류:', err);
      setError('신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <FaArrowLeft className="mr-2" />
            <h1 className="text-2xl font-bold">실버홈</h1>
          </Link>
          {user && (
            <Link href="/dashboard" className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md transition-colors">
              대시보드
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">실버홈 입주 신청</h2>
          <p className="mt-2 text-lg text-gray-600">
            안전하고 편안한 실버홈에서 새로운 생활을 시작하세요
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md shadow-sm mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-7 w-7 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-medium text-green-800">입주 신청이 완료되었습니다!</h3>
                <p className="mt-2 text-lg text-green-700">
                  신청서 검토 후 담당자가 3일 이내로 연락드릴 예정입니다. 감사합니다.
                </p>
                <p className="mt-2 text-lg text-green-700">
                  잠시 후 메인 페이지로 이동합니다...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            {/* 개인 정보 섹션 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">개인 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="홍길동"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                    생년월일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="010-1234-5678"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    현재 주소 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHome className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="현재 거주지 주소 입력"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 비상 연락처 섹션 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">비상 연락처 (가족/보호자)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                    비상 연락처 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="보호자 이름 입력"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                    비상 연락처 전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700">
                    관계 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="emergencyRelationship"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">관계 선택</option>
                    <option value="son">아들</option>
                    <option value="daughter">딸</option>
                    <option value="spouse">배우자</option>
                    <option value="sibling">형제/자매</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* 건강 상태 및 기타 정보 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">건강 상태 및 기타 정보</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="healthCondition" className="block text-sm font-medium text-gray-700">
                    현재 건강 상태
                  </label>
                  <textarea
                    id="healthCondition"
                    name="healthCondition"
                    rows={3}
                    value={formData.healthCondition}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="현재 건강 상태에 대해 알려주세요."
                  />
                </div>
                
                <div>
                  <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                    과거 질병 이력
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    rows={3}
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="과거 질병 이력에 대해 알려주세요."
                  />
                </div>
                
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                    희망 입주일
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                    추가 요청사항
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="실버홈에 입주 시 필요한 추가 요청사항이 있다면 적어주세요."
                  />
                </div>
              </div>
            </div>
            
            {/* 개인정보 동의 */}
            <div className="mb-8">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base text-gray-700">
                      제공된 개인정보는 입주 심사 목적으로만 사용되며, 관련 법률에 따라 안전하게 보관됩니다. 
                      입주 신청서 제출 시 개인정보 수집 및 이용에 동의하는 것으로 간주합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 제출 버튼 */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                입주 신청서 제출하기
              </button>
            </div>
          </form>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p> 2025 실버홈. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 입주 신청 페이지
export default function AdmissionPage() {
  return (
    <AuthWrapper>
      <AdmissionContent />
    </AuthWrapper>
  );
}
