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
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { useAppData } from '@/contexts/AppContext';
import { FaArrowLeft, FaTools, FaHome, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { Request, RequestCategory, RequestStatus, getDataFromStorage, saveDataToStorage } from '@/data/models';

function HelpRequestContent() {
  const { user } = useAuth();
  const appContext = useAppData();
  const { requests } = appContext.data;
  const { addRequest } = appContext;
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  
  const [formData, setFormData] = useState({
    category: 'cleaning' as RequestCategory,
    title: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    urgency: 'normal',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      try {
        // 비로그인 사용자는 로그인 페이지로 리다이렉트
        if (!user) {
          window.location.href = '/login';
          return;
        }
        
        // 현재 사용자의 요청 목록 필터링
        if (requests && user) {
          const filtered = requests.filter(req => req.userId === user.id);
          setMyRequests(filtered);
        } else if (user) {
          // requests가 없는 경우 (초기 로드 등) 빈 배열로 초기화
          setMyRequests([]);
        }
      } catch (error) {
        console.error('Help 페이지 데이터 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, requests]);

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
    
    // 기본 유효성 검사
    if (!formData.title || !formData.description || !formData.location) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    try {
      // 새 요청 추가
      addRequest({
        category: formData.category as RequestCategory,
        title: formData.title,
        description: formData.description,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        location: formData.location,
        urgency: formData.urgency as 'low' | 'normal' | 'high',
        userId: user!.id,
        userName: user!.name
      });
      
      // 성공 상태로 변경
      setSuccess(true);
      
      // 폼 초기화
      setFormData({
        category: 'cleaning',
        title: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        location: '',
        urgency: 'normal',
      });
      
      // 1.5초 후 성공 메시지 초기화 및 목록 탭으로 전환
      setTimeout(() => {
        setActiveTab('list');
      }, 1500);
    } catch (err) {
      console.error('요청 제출 오류:', err);
      setError('요청 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 카테고리 이름 변환 함수
  const getCategoryName = (category: RequestCategory) => {
    const categoryMap: Record<RequestCategory, string> = {
      cleaning: '청소',
      repair: '수리/보수',
      delivery: '배달/운반',
      it: 'IT 도움',
      transportation: '이동 도움',
      other: '기타',
    };
    return categoryMap[category] || category;
  };
  
  // 상태 이름 변환 함수
  const getStatusName = (status: RequestStatus) => {
    const statusMap: Record<RequestStatus, string> = {
      pending: '대기 중',
      in_progress: '처리 중',
      completed: '완료됨',
      cancelled: '취소됨',
    };
    return statusMap[status] || status;
  };
  
  // 상태별 배지 색상
  const getStatusBadgeColor = (status: RequestStatus) => {
    const colorMap: Record<RequestStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-3xl font-bold flex items-center">
              <FaArrowLeft className="mr-2" />
              실버홈
            </h1>
          </Link>
          <h2 className="text-2xl font-bold">생활 도움 요청</h2>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* 탭 네비게이션 */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('form')}
              className={`${
                activeTab === 'form'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl`}
            >
              <FaClipboardList className="inline-block mr-2" />
              도움 요청하기
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl`}
            >
              <FaClipboardList className="inline-block mr-2" />
              내 요청 목록
            </button>
          </nav>
        </div>

        {/* 도움 요청 폼 */}
        {activeTab === 'form' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {success ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h3 className="mt-3 text-2xl font-bold text-gray-900">도움 요청이 접수되었습니다!</h3>
                <p className="mt-2 text-gray-600">
                  요청이 성공적으로 접수되었습니다. 담당자 확인 후 처리될 예정입니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">도움이 필요한 내용을 작성해주세요</h3>
                
                <div>
                  <label htmlFor="category" className="block text-xl font-medium text-gray-700 mb-1">
                    도움 유형 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full px-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="cleaning">청소</option>
                      <option value="repair">수리/보수</option>
                      <option value="delivery">배달/운반</option>
                      <option value="it">IT 도움 (TV, 컴퓨터 등)</option>
                      <option value="transportation">이동 도움</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-xl font-medium text-gray-700 mb-1">
                    요청 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="요청 제목을 입력하세요"
                    className="block w-full px-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    maxLength={50}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-xl font-medium text-gray-700 mb-1">
                    상세 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="도움이 필요한 내용을 자세히 설명해주세요"
                    className="block w-full px-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="block text-xl font-medium text-gray-700 mb-1">
                      희망 날짜
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="preferredTime" className="block text-xl font-medium text-gray-700 mb-1">
                      희망 시간
                    </label>
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="block w-full px-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-xl font-medium text-gray-700 mb-1">
                    장소 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHome className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="도움이 필요한 장소 (예: 101호, 주방)"
                      className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="urgency" className="block text-xl font-medium text-gray-700 mb-1">
                    긴급도
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="block w-full px-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="low">낮음 (여유있게 처리해도 됨)</option>
                    <option value="normal">보통 (일반적인 처리 속도면 충분)</option>
                    <option value="high">높음 (가능한 빨리 처리 필요)</option>
                  </select>
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
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
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTools className="mr-2" />
                    도움 요청하기
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 요청 목록 */}
        {activeTab === 'list' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">내 요청 목록</h3>
            
            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <FaClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-xl font-medium text-gray-900">요청 내역이 없습니다</h3>
                <p className="mt-1 text-gray-500">새로운 도움 요청을 등록해보세요.</p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  도움 요청하기
                </button>
              </div>
            ) : (
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {myRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((request) => (
                    <li key={request.id} className="py-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-2 md:mb-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                            {getStatusName(request.status)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          {getCategoryName(request.category)}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <h4 className="text-xl font-semibold text-gray-900">{request.title}</h4>
                        <p className="mt-1 text-gray-600">{request.description}</p>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">장소:</span> {request.location}
                        </div>
                        {request.preferredDate && (
                          <div>
                            <span className="font-medium">희망일:</span> {request.preferredDate}
                          </div>
                        )}
                        {request.preferredTime && (
                          <div>
                            <span className="font-medium">희망시간:</span> {request.preferredTime}
                          </div>
                        )}
                      </div>
                      
                      {request.status === 'completed' && request.feedback && (
                        <div className="mt-2 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">피드백:</span> {request.feedback}
                          </p>
                        </div>
                      )}
                      
                      {request.status === 'pending' && (
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              // 취소 로직 - 실제 취소 기능이 없으므로 메시지 표시
                              alert('취소 기능은 아직 구현되지 않았습니다. 관리자에게 문의하세요.');
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            요청 취소하기
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 생활 도움 요청 페이지
export default function HelpRequestPage() {
  return (
    <AuthWrapper>
      <HelpRequestContent />
    </AuthWrapper>
  );
}
