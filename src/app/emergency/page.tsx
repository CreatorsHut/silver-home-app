'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { useAppData } from '@/contexts/AppContext';
import { EmergencyCall, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaExclamationTriangle, FaPhoneAlt, FaMapMarkerAlt, FaHistory, FaArrowLeft } from 'react-icons/fa';

function EmergencyCallContent() {
  const { user } = useAuth();
  const { data } = useAppData();
  
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [isCallingEmergency, setIsCallingEmergency] = useState(false);
  const [callSuccess, setCallSuccess] = useState(false);
  const [callHistory, setCallHistory] = useState<EmergencyCall[]>([]);
  const [activeTab, setActiveTab] = useState<'call' | 'history'>('call');
  
  // 기본 데이터 로딩
  useEffect(() => {
    // 기존 로직은 AuthWrapper에서 처리
    if (typeof window !== 'undefined') {
      // 추가 초기화 로직이 필요하면 여기에 추가
    }
  }, [user]);
  
  // 긴급 호출 내역 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!data || !data.emergencyCalls || !user) return;
      
      // 현재 사용자의 긴급 호출 내역만 필터링
      const userCalls = data.emergencyCalls.filter(call => call?.userId === user.id) || [];
      setCallHistory(userCalls);
    }
  }, [data, user]);
  
  // 긴급 호출 발신
  const handleEmergencyCall = () => {
    if (!user) return;
    
    setIsCallingEmergency(true);
    
    // 실제 앱에서는 여기서 실시간 알림 서비스를 통해 관리자에게 알림 전송
    setTimeout(() => {
      try {
        // 긴급 호출 데이터 생성
        const newEmergencyCall: EmergencyCall = {
          id: `emergency-${Date.now()}`,
          userId: user.id,
          userName: user.name || '사용자',
          timestamp: new Date().toISOString(),
          status: 'pending',
          location: location || '위치 정보 없음',
          message: message || '긴급 도움 요청',
          createdAt: new Date().toISOString(),
        };
        
        // 로컬 스토리지에 데이터 저장 (AppContext 대신 직접 저장)
        if (typeof window !== 'undefined') {
          const appData = localStorage.getItem('silverHomeData');
          if (appData) {
            const parsedData = JSON.parse(appData);
            if (!parsedData.emergencyCalls) {
              parsedData.emergencyCalls = [];
            }
            parsedData.emergencyCalls.push(newEmergencyCall);
            localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
          }
        }
        
        // 호출 내역에 추가
        setCallHistory(prevCalls => [...prevCalls, newEmergencyCall]);
        
        setCallSuccess(true);
        
        // 3초 후 상태 초기화
        setTimeout(() => {
          setIsCallingEmergency(false);
          setCallSuccess(false);
          setMessage('');
          setLocation('');
        }, 3000);
      } catch (err) {
        console.error('긴급 호출 오류:', err);
        setIsCallingEmergency(false);
        alert('긴급 호출 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }, 2000);
  };
  
  // 날짜 형식 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">긴급 호출</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 탭 선택 */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('call')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'call'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              긴급 호출
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'history'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              호출 내역
            </button>
          </div>
        </div>
        
        {activeTab === 'call' ? (
          <div>
            {/* 긴급 호출 안내 */}
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800">
                    긴급 상황 시 이용하세요
                  </h3>
                  <div className="mt-2 text-red-700">
                    <p>이 기능은 응급 상황이나 긴급한 도움이 필요할 때만 사용하세요.</p>
                    <p className="mt-1">호출 시 관리자에게 즉시 알림이 전송되며, 신속하게 도움을 제공해 드립니다.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">현재 위치 정보</h2>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  상세 위치
                </label>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="현재 위치를 입력하세요 (예: 101호, 휴게실, 식당 등)"
                    className="flex-1 block w-full focus:ring-red-500 focus:border-red-500 shadow-sm sm:text-lg border-gray-300 rounded-md p-3"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  상황 설명 (선택사항)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="현재 상황을 간략히 설명해주세요..."
                  className="block w-full focus:ring-red-500 focus:border-red-500 shadow-sm sm:text-lg border-gray-300 rounded-md p-3"
                />
              </div>
            </div>
            
            {/* 긴급 호출 버튼 */}
            <div className="text-center mb-8">
              <button
                onClick={handleEmergencyCall}
                disabled={isCallingEmergency || callSuccess}
                className={`
                  text-center px-6 py-5 rounded-xl shadow-lg text-white text-2xl font-bold
                  ${isCallingEmergency || callSuccess
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 animate-pulse'}
                  flex items-center justify-center w-full
                `}
              >
                {isCallingEmergency ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    긴급 호출 중...
                  </span>
                ) : callSuccess ? (
                  <span className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    호출 완료! 곧 도움이 도착합니다.
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaPhoneAlt className="mr-3" />
                    긴급 호출하기
                  </span>
                )}
              </button>
              <p className="mt-3 text-gray-500 text-sm">
                {isCallingEmergency
                  ? '관리자에게 알림을 전송 중입니다...'
                  : callSuccess
                    ? '관리자가 곧 연락드릴 예정입니다.'
                    : '버튼을 누르면 즉시 관리자에게 알림이 전송됩니다.'}
              </p>
            </div>
            
            {/* 직접 전화 */}
            <div className="text-center">
              <p className="text-gray-700 mb-2">또는 직접 전화로 연락하기</p>
              <a
                href="tel:02-123-4567"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaPhoneAlt className="mr-2 text-red-600" />
                02-123-4567
              </a>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaHistory className="mr-2" />
              긴급 호출 내역
            </h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {callHistory && callHistory.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {callHistory.map((call) => (
                    <div key={call?.id || call?.createdAt || call?.timestamp} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            {call?.resolvedAt ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                                처리 완료
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mr-2">
                                진행중
                              </span>
                            )}
                            <span className="text-gray-600">
                              {formatDate(call?.createdAt || call?.timestamp)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-1">
                            위치: {call?.location || '정보 없음'}
                          </div>
                          
                          {call?.message && (
                            <div className="text-sm text-gray-600 mb-1">
                              내용: {call?.message}
                            </div>
                          )}
                          
                          {call?.resolvedAt && call?.resolution && (
                            <div className="mt-2 bg-gray-50 p-3 rounded-md">
                              <p className="text-sm font-medium text-gray-700">처리 내용:</p>
                              <p className="text-sm text-gray-600">{call?.resolution}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                처리 시간: {formatDate(call?.resolvedAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p>긴급 호출 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p> 2025 .</p>
        </div>
      </footer>
    </div>
  );
}

// 
export default function EmergencyCallPage() {
  return (
    <AuthWrapper>
      <EmergencyCallContent />
    </AuthWrapper>
  );
}
