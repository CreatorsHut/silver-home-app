'use client';

// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useState, useEffect } from 'react';
import nextDynamic from 'next/dynamic';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaArrowLeft, FaVideo, FaPhone, FaUser, FaHeart, FaClock, FaStar } from 'react-icons/fa';

function FamilyContent() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'contacts' | 'call' | 'history'>('contacts');
  const [familyContacts, setFamilyContacts] = useState<any[]>([]);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isFavoriteFilter, setIsFavoriteFilter] = useState(false);

  // 통화 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // 데이터 로딩 (인증 체크는 AuthWrapper에서 처리)
  useEffect(() => {
    if (!user) {
      return;
    }
    
    // 로컬스토리지에서 가족 연락처 데이터 가져오기
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
        const { users } = JSON.parse(storedData);
        
        // 현재 사용자 정보 가져오기
        const currentUser = users.find((u: any) => u.id === user.id);
        
        if (currentUser) {
          // 가족 연락처 데이터 설정
          const contacts = currentUser.emergencyContacts || [];
          setFamilyContacts([
            ...contacts,
            // 샘플 데이터 추가 (실제 앱에서는 서버에서 가져올 것)
            { id: 'f1', name: '김철수', relationship: '아들', phone: '010-1234-5678', isFavorite: true, lastCall: '2025-05-25T14:30:00' },
            { id: 'f2', name: '이영희', relationship: '딸', phone: '010-8765-4321', isFavorite: false, lastCall: '2025-05-20T10:15:00' },
            { id: 'f3', name: '박지민', relationship: '손자', phone: '010-2222-3333', isFavorite: true, lastCall: '2025-05-29T16:45:00' }
          ]);
          
          // 통화 내역 샘플 데이터 설정
          setCallHistory([
            { id: 'c1', contactId: 'f1', contactName: '김철수', type: 'video', duration: 420, timestamp: '2025-05-29T16:45:00', status: 'completed' },
            { id: 'c2', contactId: 'f2', contactName: '이영희', type: 'audio', duration: 185, timestamp: '2025-05-27T11:20:00', status: 'completed' },
            { id: 'c3', contactId: 'f3', contactName: '박지민', type: 'video', duration: 630, timestamp: '2025-05-25T14:30:00', status: 'completed' },
            { id: 'c4', contactId: 'f1', contactName: '김철수', type: 'audio', duration: 92, timestamp: '2025-05-23T09:15:00', status: 'missed' },
            { id: 'c5', contactId: 'f2', contactName: '이영희', type: 'video', duration: 0, timestamp: '2025-05-20T10:15:00', status: 'missed' }
          ]);
        }
      }
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('가족 연락처 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 통화 시간 포맷팅 함수
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 날짜 포맷팅 함수
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

  // 연락처 필터링
  const filteredContacts = familyContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery);
    
    if (isFavoriteFilter) {
      return matchesSearch && contact.isFavorite;
    }
    
    return matchesSearch;
  });

  // 통화 시작 핸들러
  const handleStartCall = (contact: any, type: 'audio' | 'video') => {
    setSelectedContact(contact);
    setActiveTab('call');
    setIsCallActive(true);
    setCallTimer(0);
    
    // 실제 앱에서는 여기서 WebRTC 또는 다른 통화 API를 호출
  };

  // 통화 종료 핸들러
  const handleEndCall = () => {
    // 통화 내역에 추가
    const newCall = {
      id: `c${Date.now()}`,
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      type: 'video', // 또는 'audio'
      duration: callTimer,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  
    // UI 상태 업데이트
    setCallHistory(prev => {
      const updatedHistory = [newCall, ...prev];
      
      // localStorage에 통화 내역 저장
      if (typeof window !== 'undefined' && user) {
        try {
          const storedData = localStorage.getItem('silverHomeData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            const users = parsedData.users || [];
            
            // 현재 사용자 찾기
            const userIndex = users.findIndex((u: any) => u.id === user.id);
            
            if (userIndex >= 0) {
              // 통화 내역 업데이트
              if (!users[userIndex].callHistory) {
                users[userIndex].callHistory = [];
              }
              
              users[userIndex].callHistory = updatedHistory;
              
              // 업데이트된 데이터 저장
              parsedData.users = users;
              localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
            }
          }
        } catch (err) {
          console.error('통화 내역 저장 오류:', err);
        }
      }
      
      return updatedHistory;
    });
    
    setIsCallActive(false);
    setCallTimer(0);
  };

  // 즐겨찾기 토글 함수
  const toggleFavorite = (contactId: string) => {
    // UI 상태 업데이트
    setFamilyContacts(prev => {
      const updatedContacts = prev.map(contact => 
        contact.id === contactId 
          ? {...contact, isFavorite: !contact.isFavorite} 
          : contact
      );
      
      // localStorage에 변경 내용 저장
      if (typeof window !== 'undefined' && user) {
        try {
          const storedData = localStorage.getItem('silverHomeData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            const users = parsedData.users || [];
            
            // 현재 사용자 찾기
            const userIndex = users.findIndex((u: any) => u.id === user.id);
            
            if (userIndex >= 0) {
              // 즐겨찾기 업데이트
              users[userIndex].emergencyContacts = updatedContacts.filter(c => 
                // 기본 샘플 데이터가 아닌 실제 사용자 데이터만 저장
                !['f1', 'f2', 'f3'].includes(c.id)
              );
              
              // 업데이트된 데이터 저장
              parsedData.users = users;
              localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
            }
          }
        } catch (err) {
          console.error('즐겨찾기 저장 오류:', err);
        }
      }
      
      return updatedContacts;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <FaArrowLeft className="mr-2" />
            <h1 className="text-2xl font-bold">가족 소통창구</h1>
          </Link>
          
          <div className="flex space-x-4">
            {user && (
              <span className="flex items-center">
                <FaUser className="mr-1" /> {user.name}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {/* 탭 네비게이션 */}
        {!isCallActive && (
          <div className="bg-white shadow-sm rounded-lg mb-6">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-4 px-4 text-center text-lg font-medium ${
                  activeTab === 'contacts' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                가족 연락처
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 px-4 text-center text-lg font-medium ${
                  activeTab === 'history' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                통화 내역
              </button>
            </nav>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
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
        ) : (
          <>
            {activeTab === 'contacts' && !isCallActive && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">가족 연락처</h2>
                    <button 
                      onClick={() => setIsFavoriteFilter(!isFavoriteFilter)}
                      className={`flex items-center px-3 py-1 rounded-full ${
                        isFavoriteFilter 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <FaStar className={`mr-1 ${isFavoriteFilter ? 'text-yellow-500' : ''}`} />
                      즐겨찾기
                    </button>
                  </div>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      placeholder="이름 또는 전화번호 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery 
                      ? '검색 결과가 없습니다.' 
                      : '등록된 가족 연락처가 없습니다.'}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <li key={contact.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">
                            {contact.name[0]}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600 mr-3">{contact.relationship}</span>
                              <span className="text-sm text-gray-600">{contact.phone}</span>
                            </div>
                            {contact.lastCall && (
                              <p className="text-xs text-gray-500 mt-1">
                                최근 통화: {formatDate(contact.lastCall)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleStartCall(contact, 'audio')}
                            className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                            title="음성 통화"
                          >
                            <FaPhone />
                          </button>
                          <button 
                            onClick={() => handleStartCall(contact, 'video')}
                            className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                            title="영상 통화"
                          >
                            <FaVideo />
                          </button>
                          <button 
                            onClick={() => toggleFavorite(contact.id)}
                            className={`p-2 rounded-full ${
                              contact.isFavorite 
                                ? 'bg-yellow-100 text-yellow-500' 
                                : 'bg-gray-100 text-gray-400'
                            } hover:bg-yellow-200`}
                            title={contact.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                          >
                            <FaStar />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {activeTab === 'history' && !isCallActive && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">통화 내역</h2>
                
                {callHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    통화 내역이 없습니다.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {callHistory.map((call) => (
                      <li key={call.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              call.status === 'missed' 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {call.type === 'video' ? <FaVideo /> : <FaPhone />}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">{call.contactName}</h3>
                              <p className="text-sm text-gray-600">
                                {call.status === 'missed' ? '부재중 전화' : (
                                  call.duration > 0 
                                    ? `통화 시간: ${Math.floor(call.duration / 60)}분 ${call.duration % 60}초` 
                                    : '통화 실패'
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{formatDate(call.timestamp)}</p>
                            {call.status === 'missed' && (
                              <button 
                                onClick={() => {
                                  const contact = familyContacts.find(c => c.id === call.contactId);
                                  if (contact) handleStartCall(contact, call.type as 'audio' | 'video');
                                }}
                                className="mt-1 text-sm text-red-600 hover:text-red-800"
                              >
                                전화 걸기
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {(activeTab === 'call' || isCallActive) && selectedContact && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-5xl mx-auto">
                    {selectedContact.name[0]}
                  </div>
                  <h2 className="text-2xl font-bold mt-4">{selectedContact.name}</h2>
                  <p className="text-gray-600">{selectedContact.relationship}</p>
                  
                  <div className="mt-4 flex items-center justify-center">
                    <FaClock className="text-gray-500 mr-2" />
                    <span className="text-xl">{formatCallDuration(callTimer)}</span>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <button className="p-4 bg-gray-100 text-gray-600 rounded-full mx-auto">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleEndCall}
                      className="p-4 bg-red-600 text-white rounded-full mx-auto hover:bg-red-700"
                    >
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button className="p-4 bg-gray-100 text-gray-600 rounded-full mx-auto">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01.707-7.07m-2.82 9.9a9 9 0 01.707-12.728" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <div className="p-4 bg-black w-full h-72 rounded-lg">
                      <div className="flex items-center justify-center h-full text-white">
                        <div>
                          <FaVideo className="mx-auto text-3xl mb-2 text-red-500" />
                          <p>카메라가 연결되지 않았습니다.</p>
                          <p className="text-sm text-gray-400">실제 앱에서는 여기에 영상이 표시됩니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
