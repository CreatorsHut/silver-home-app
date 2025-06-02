'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기
export const config = {
  dynamic: 'force-dynamic'
};
  
// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지


;

import { useState, useEffect } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

// 신청서 섹션 타입 정의
interface BasicInfo {
  name: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  emergencyContact: string;
  email?: string;
}

interface MedicalInfo {
  healthCondition: string;
  disabilities: string;
  medications: string;
  allergies: string;
  doctorName: string;
  doctorPhone: string;
}

interface FinancialInfo {
  incomeSource: string;
  monthlyIncome: string;
  financialSupport: string;
  insuranceType: string;
  insuranceNumber: string;
}

interface PreferencesInfo {
  roomType: string;
  dietaryRestrictions: string;
  hobbies: string;
  specialRequests: string;
}

// 전체 폼 데이터 타입 정의
interface ApplicationFormData {
  basicInfo: BasicInfo;
  medicalInfo: MedicalInfo;
  financialInfo: FinancialInfo;
  preferencesInfo: PreferencesInfo;
  termsAgreed: boolean;
  [key: string]: any; // 추가 임의 필드를 위한 인덱서 서명
}

// 신청서 타입 정의
interface ApplicationData {
  userId: string;
  userName: string;
  submittedAt: string;
  formData: ApplicationFormData;
  status?: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

function ApplicationContent() {
  const { user } = useAuth();
  const { data } = useAppData();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    basicInfo: {
      name: '',
      birthdate: '',
      gender: '',
      address: '',
      phone: '',
      emergencyContact: '',
      email: ''
    },
    medicalInfo: {
      healthCondition: '',
      disabilities: '',
      medications: '',
      allergies: '',
      doctorName: '',
      doctorPhone: ''
    },
    financialInfo: {
      incomeSource: '',
      monthlyIncome: '',
      financialSupport: '',
      insuranceType: '',
      insuranceNumber: ''
    },
    preferencesInfo: {
      roomType: '',
      dietaryRestrictions: '',
      hobbies: '',
      specialRequests: ''
    },
    termsAgreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [existingApplication, setExistingApplication] = useState<ApplicationData | null>(null);

  // 기존 신청서 확인 (사용자 인증은 AuthWrapper에서 처리)
  useEffect(() => {
    if (!user) {
      return;
    }
    
    // 사용자 정보로 폼 초기화
    if (user) {
      setFormData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          name: user.name || '',
          phone: user.phone || '',
        }
      }));
    }
    
    // 기존 신청서 확인
    if (data && data.applications) {
      const userApplication = data.applications.find(app => app.userId === user.id);
      if (userApplication) {
        // 타입 호환성 문제 해결
        setExistingApplication(userApplication as unknown as ApplicationData);
      }
    }
  }, [user, data]);
  
  // 폼 입력값 변경 처리
  const handleInputChange = (section: keyof ApplicationFormData, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  // 다음 단계로 이동
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // 신청서 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }
    
    if (!formData.termsAgreed) {
      alert('개인정보 수집 및 이용 동의가 필요합니다.');
      setCurrentStep(5); // 약관 동의 단계로 이동
      return;
    }
    
    setIsSubmitting(true);
    
    // 실제 앱에서는 이 부분에서 API 호출하여 서버에 데이터 전송
    setTimeout(() => {
      try {
        // 신청서 데이터 생성
        const newApplication: ApplicationData = {
          userId: user!.id,
          userName: formData.basicInfo.name,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          formData: formData
        };
        
        // 로컬 스토리지에 데이터 저장 (AppContext 대신 직접 저장)
        if (typeof window !== 'undefined') {
          const silverHomeData = localStorage.getItem('silverHomeData');
          if (silverHomeData) {
            const parsedData = JSON.parse(silverHomeData);
            if (!parsedData.applications) {
              parsedData.applications = [];
            }
            parsedData.applications.push(newApplication);
            localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
          }
        }
        
        // 기존 신청서로 설정
        setExistingApplication(newApplication);
        setSubmitSuccess(true);
        setIsSubmitting(false);
        
        // 3초 후 제출 성공 상태 해제
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('신청서 제출 오류:', err);
        setIsSubmitting(false);
        alert('신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }, 1500); // 실제 데이터 전송 시뮬레이션을 위한 타임아웃
  };
  
  // 사용자 인증 체크
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  // 기존 신청서가 있는 경우
  if (existingApplication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">신청서 상태</h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center mb-6">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">신청서가 제출되었습니다</h2>
              <p className="mt-2 text-gray-600">
                신청서 검토는 일반적으로 3-5일 소요됩니다. 결과는 입력하신 연락처로 알려드립니다.
              </p>
            </div>
            
            <div className="mb-6">
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">신청 상태</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    existingApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                    existingApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {existingApplication.status === 'approved' ? '승인됨' :
                    existingApplication.status === 'rejected' ? '거절됨' :
                    '검토 중'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                신청서 검토는 일반적으로 3-5일 정도 소요됩니다.
                {existingApplication.status === 'pending' && '관리자가 검토 후 연락드릴 예정입니다.'}
                {existingApplication.status === 'approved' && '입주 일정 조정을 위해 곧 연락드릴 예정입니다.'}
                {existingApplication.status === 'rejected' && existingApplication.reviewNotes && 
                  `거절 사유: ${existingApplication.reviewNotes}`}
              </p>
              <Link href="/dashboard" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                대시보드로 돌아가기
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // 신청서 제출 성공
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">입주 신청</h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">입주 신청이 성공적으로 제출되었습니다</h2>
            <p className="text-gray-600 mb-6">관리자 검토 후 연락드리겠습니다.</p>
            <p className="text-gray-500 mb-4">대시보드로 자동 이동합니다...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">입주 신청</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                  ${currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step}
                </div>
                <div className="text-xs mt-2">
                  {step === 1 && '기본 정보'}
                  {step === 2 && '건강 상태'}
                  {step === 3 && '비상 연락처'}
                  {step === 4 && '약관 동의'}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-red-600 transition-all"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* 단계 1: 기본 정보 */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">기본 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.basicInfo.name}
                      onChange={(e) => handleInputChange('basicInfo', 'name', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                      생년월일 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      id="birthdate"
                      value={formData.basicInfo.birthdate}
                      onChange={(e) => handleInputChange('basicInfo', 'birthdate', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      성별
                    </label>
                    <select
                      id="gender"
                      value={formData.basicInfo.gender}
                      onChange={(e) => handleInputChange('basicInfo', 'gender', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">선택해주세요</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      연락처 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.basicInfo.phone}
                      onChange={(e) => handleInputChange('basicInfo', 'phone', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      현재 주소 <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={formData.basicInfo.address}
                      onChange={(e) => handleInputChange('basicInfo', 'address', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 단계 2: 건강 상태 */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6">건강 상태</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      건강 상태 (해당하는 항목 모두 선택)
                    </label>
                    <div className="space-y-2">
                      {['고혈압', '당뇨', '심장질환', '관절염', '치매', '기타'].map(condition => (
                        <div key={condition} className="flex items-center">
                          <input
                            type="checkbox"
                            id={condition}
                            checked={formData.healthInfo.conditions.includes(condition)}
                            onChange={() => {
                              const conditions = [...formData.healthInfo.conditions];
                              const index = conditions.indexOf(condition);
                              if (index > -1) {
                                conditions.splice(index, 1);
                              } else {
                                conditions.push(condition);
                              }
                              handleInputChange('healthInfo', 'conditions', conditions);
                            }}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor={condition} className="ml-2 text-sm text-gray-700">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                      복용 중인 약물
                    </label>
                    <textarea
                      id="medications"
                      rows={3}
                      value={formData.healthInfo.medications}
                      onChange={(e) => handleInputChange('healthInfo', 'medications', e.target.value)}
                      placeholder="복용 중인 약물이 있다면 기입해주세요."
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                      알레르기
                    </label>
                    <textarea
                      id="allergies"
                      rows={2}
                      value={formData.healthInfo.allergies}
                      onChange={(e) => handleInputChange('healthInfo', 'allergies', e.target.value)}
                      placeholder="알레르기가 있다면 기입해주세요."
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobility" className="block text-sm font-medium text-gray-700 mb-1">
                      활동성
                    </label>
                    <select
                      id="mobility"
                      value={formData.healthInfo.mobility}
                      onChange={(e) => handleInputChange('healthInfo', 'mobility', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="independent">자립 활동 가능</option>
                      <option value="partial">부분적 도움 필요</option>
                      <option value="dependent">전적 도움 필요</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="additionalNeeds" className="block text-sm font-medium text-gray-700 mb-1">
                      추가 지원 필요 사항
                    </label>
                    <textarea
                      id="additionalNeeds"
                      rows={3}
                      value={formData.healthInfo.additionalNeeds}
                      onChange={(e) => handleInputChange('healthInfo', 'additionalNeeds', e.target.value)}
                      placeholder="추가 지원이 필요한 사항이 있다면 기입해주세요."
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 단계 3: 비상 연락처 */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6">비상 연락처</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ecName" className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="ecName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ecRelationship" className="block text-sm font-medium text-gray-700 mb-1">
                      관계 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="ecRelationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                      placeholder="예: 자녀, 배우자, 형제, 친구 등"
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ecPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      연락처 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="ecPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ecAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      주소
                    </label>
                    <textarea
                      id="ecAddress"
                      rows={3}
                      value={formData.emergencyContact.address}
                      onChange={(e) => handleInputChange('emergencyContact', 'address', e.target.value)}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 단계 4: 약관 동의 */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-6">약관 동의</h2>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-lg font-semibold mb-2">개인정보 수집 및 이용 동의</h3>
                  <div className="text-sm text-gray-700 h-40 overflow-y-auto border border-gray-300 rounded-md p-3 mb-4">
                    <p className="mb-2">1. 수집하는 개인정보 항목</p>
                    <p className="mb-2">성명, 생년월일, 성별, 연락처, 주소, 건강상태, 비상연락처</p>
                    <p className="mb-2">2. 개인정보의 수집 및 이용 목적</p>
                    <p className="mb-2">입주 신청 심사, 입주 관리, 의료 서비스 제공, 비상 시 연락</p>
                    <p className="mb-2">3. 개인정보의 보유 및 이용 기간</p>
                    <p className="mb-2">입주 종료 후 5년간 보관 후 파기됩니다.</p>
                    <p className="mb-4">4. 동의 거부 권리 및 동의 거부에 따른 불이익</p>
                    <p>귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의하지 않을 경우 입주 신청이 제한됩니다.</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="termsAgreed"
                      checked={formData.termsAgreed}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          termsAgreed: e.target.checked
                        }));
                      }}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="termsAgreed" className="ml-2 text-sm text-gray-700">
                      위 개인정보 수집 및 이용에 동의합니다. <span className="text-red-600">*</span>
                    </label>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>참고:</strong> 입주 신청 후 관리자의 검토가 진행됩니다. 검토 기간은 약 3-5일 소요되며,
                    검토 결과는 입력하신 연락처로 안내드립니다.
                  </p>
                </div>
              </div>
            )}
            
            {/* 이전/다음/제출 버튼 */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  이전
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  다음
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.termsAgreed}
                  className={`ml-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${(isSubmitting || !formData.termsAgreed) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      제출 중...
                    </div>
                  ) : (
                    '제출하기'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 신청서 페이지
export default function ApplicationPage() {
  return (
    <AuthWrapper>
      <ApplicationContent />
    </AuthWrapper>
  );
}
