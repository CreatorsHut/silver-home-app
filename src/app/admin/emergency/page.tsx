'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기
export const config = {
  dynamic: 'force-dynamic'
};

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { useAppData } from '@/contexts/AppContext';
import { EmergencyCall, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaExclamationTriangle, FaCheck, FaPhoneAlt, FaMapMarkerAlt, FaUserCircle, FaCalendarAlt, FaEye } from 'react-icons/fa';

function EmergencyContent() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { data } = useAppData();
  
  const [emergencyCalls, setEmergencyCalls] = useState<EmergencyCall[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [selectedCall, setSelectedCall] = useState<EmergencyCall | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  
  // 긴급 호출 데이터 로드
  useEffect(() => {
    if (!data || !data.emergencyCalls) return;
    
    setEmergencyCalls(data.emergencyCalls);
  }, [data]);
  
  // 필터링된 긴급 호출 목록
  const filteredCalls = emergencyCalls?.filter(call => {
    if (!call) return false;
    if (activeTab === 'active') {
      return !call.resolvedAt;
    } else {
      return !!call.resolvedAt;
    }
  }) || [];
  
  // 긴급 호출 처리 완료
  const handleResolveEmergency = () => {
    if (!selectedCall || !resolutionNote.trim()) return;
    
    try {
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') return;
      
      // 로컬 스토리지에서 데이터 가져오기
      const appData = getDataFromStorage();
      
      // 선택된 긴급 호출 상태 업데이트
      const updatedCalls = appData.emergencyCalls?.map(call => {
        if (call.id === selectedCall?.id) {
          return {
            ...call,
            resolvedAt: new Date().toISOString(),
            resolvedBy: user?.id || 'unknown',
            resolution: resolutionNote.trim()
          };
        }
        return call;
      }) || [];
      
      // 업데이트된 데이터 저장
      appData.emergencyCalls = updatedCalls;
      saveDataToStorage(appData);
      
      // UI 상태 업데이트
      setEmergencyCalls(updatedCalls);
      setIsModalOpen(false);
      setSelectedCall(null);
      setResolutionNote('');
      
      alert('긴급 호출이 처리되었습니다.');
    } catch (err) {
      console.error('긴급 호출 처리 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
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
  
  // 경과 시간 계산
  const getElapsedTime = (dateString: string) => {
    const callTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const elapsed = now - callTime;
    
    const minutes = Math.floor(elapsed / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes % 60}분 전`;
    } else {
      return `${minutes}분 전`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">긴급 상황 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 탭 선택 */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'active'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              진행중
              {filteredCalls.length > 0 && activeTab === 'active' && (
                <span className="ml-2 px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                  {filteredCalls.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'resolved'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              처리 완료
            </button>
          </div>
        </div>
        
        {/* 긴급 호출 목록 */}
        <div className="space-y-4">
          {filteredCalls.length > 0 ? (
            filteredCalls.map((call) => (
              <div 
                key={call.id}
                className={`bg-white shadow-sm rounded-lg overflow-hidden border-l-4 ${
                  !call.resolvedAt 
                    ? 'border-red-600 animate-pulse' 
                    : 'border-green-600'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        {!call.resolvedAt && (
                          <FaExclamationTriangle className="text-red-600 mr-2" />
                        )}
                        <h3 className="text-lg font-bold">
                          {call.userName}님의 긴급 호출
                        </h3>
                        {!call.resolvedAt && (
                          <span className="ml-3 text-sm text-red-600 font-semibold">
                            {getElapsedTime(call.createdAt)}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-500 mr-2" />
                          <span>{call.location || '위치 정보 없음'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-500 mr-2" />
                          <span>{formatDate(call.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUserCircle className="text-gray-500 mr-2" />
                          <span>입주자 ID: {call.userId}</span>
                        </div>
                        {call.resolvedAt && (
                          <div className="flex items-center">
                            <FaCheck className="text-green-600 mr-2" />
                            <span>처리 완료: {formatDate(call.resolvedAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      {call.message && (
                        <div className="mb-4">
                          <p className="text-gray-700">{call.message}</p>
                        </div>
                      )}
                      
                      {call.resolvedAt && call.resolution && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2">처리 내용</h4>
                          <p className="text-gray-700">{call.resolution}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {!call.resolvedAt ? (
                        <>
                          <button
                            onClick={() => {
                              // 사용자 ID를 이용해 사용자 정보 찾기
                              const userInfo = data?.users?.find(u => u?.id === call?.userId);
                              const phoneNumber = userInfo?.phone || '010-0000-0000';
                              window.open(`tel:${phoneNumber}`);
                            }}
                            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            <FaPhoneAlt className="mr-2" />
                            통화
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCall(call);
                              setIsModalOpen(true);
                            }}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            <FaCheck className="mr-2" />
                            처리
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCall(call);
                            setIsModalOpen(true);
                            setResolutionNote(call.resolution || '');
                          }}
                          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          <FaEye className="mr-2" />
                          상세보기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {activeTab === 'active' 
                  ? '현재 진행 중인 긴급 호출이 없습니다.' 
                  : '처리된 긴급 호출 내역이 없습니다.'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'active'
                  ? '새로운 긴급 호출이 발생하면 이 페이지에 표시됩니다.' 
                  : '긴급 호출이 처리되면 이 탭에서 기록을 확인할 수 있습니다.'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* 긴급 호출 상세 모달 */}
      {isModalOpen && selectedCall && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedCall?.resolvedAt 
                      ? '긴급 호출 상세 정보'
                      : '긴급 호출 처리'}
                  </h3>
                  <div className="mt-4">
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h4 className="font-semibold mb-2">호출 정보</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">입주자:</span> {selectedCall?.userName}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">위치:</span> {selectedCall?.location || '정보 없음'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">시간:</span> {selectedCall?.createdAt ? formatDate(selectedCall.createdAt) : formatDate(selectedCall?.timestamp)}
                      </p>
                      {selectedCall?.message && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">메시지:</span> {selectedCall.message}
                        </p>
                      )}
                    </div>
                    
                    {!selectedCall?.resolvedAt ? (
                      <div>
                        <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                          처리 내용
                        </label>
                        <textarea
                          id="resolution"
                          rows={4}
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          placeholder="긴급 호출 처리 내용을 상세히 기록하세요..."
                          className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-semibold mb-2">처리 내용</h4>
                        <p className="text-gray-700">{selectedCall?.resolution || '없음'}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          처리 시간: {selectedCall?.resolvedAt ? formatDate(selectedCall.resolvedAt) : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                {!selectedCall?.resolvedAt ? (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleResolveEmergency}
                      disabled={!resolutionNote.trim()}
                    >
                      <FaCheck className="mr-2" />
                      처리 완료
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedCall(null);
                        setResolutionNote('');
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedCall(null);
                      setResolutionNote('');
                    }}
                  >
                    닫기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈 관리자 시스템. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 인증된 관리자만 접근 가능한 긴급 상황 관리 페이지
export default function EmergencyManagement() {
  return (
    <AuthWrapper requiredRole="admin">
      <EmergencyContent />
    </AuthWrapper>
  );
}
