'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { FaArrowLeft, FaVideo, FaPhone, FaUser, FaClock, FaStar, FaSearch } from 'react-icons/fa';

// 타입 정의
interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isFavorite: boolean;
  lastCall?: string;
}

interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  type: 'video' | 'audio';
  duration: number;
  timestamp: string;
  status: 'completed' | 'missed';
}

interface UserData {
  id: string;
  name?: string;
  email?: string;
  emergencyContacts?: FamilyContact[];
  callHistory?: CallRecord[];
}

// 메인 페이지 컴포넌트
export default function FamilyPage() {
  return (
    <AuthWrapper>
      <FamilyContent />
    </AuthWrapper>
  );
}

// 가족 연락처 페이지 내용 컴포넌트
function FamilyContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'contacts' | 'history' | 'call'>('contacts');
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([
    { id: 'f1', name: '김철수', relationship: '아들', phone: '010-1234-5678', isFavorite: true, lastCall: '2025-05-25T14:30:00' },
    { id: 'f2', name: '이영희', relationship: '딸', phone: '010-8765-4321', isFavorite: false, lastCall: '2025-05-20T10:15:00' },
    { id: 'f3', name: '박지민', relationship: '손자', phone: '010-2222-3333', isFavorite: true, lastCall: '2025-05-29T16:45:00' }
  ]);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    { id: 'c1', contactId: 'f1', contactName: '김철수', type: 'video', duration: 420, timestamp: '2025-05-29T16:45:00', status: 'completed' },
    { id: 'c2', contactId: 'f2', contactName: '이영희', type: 'audio', duration: 185, timestamp: '2025-05-27T11:20:00', status: 'completed' },
    { id: 'c3', contactId: 'f3', contactName: '박지민', type: 'video', duration: 630, timestamp: '2025-05-25T14:30:00', status: 'completed' },
    { id: 'c4', contactId: 'f1', contactName: '김철수', type: 'audio', duration: 92, timestamp: '2025-05-23T09:15:00', status: 'missed' },
    { id: 'c5', contactId: 'f2', contactName: '이영희', type: 'video', duration: 0, timestamp: '2025-05-20T10:15:00', status: 'missed' }
  ]);
  const [selectedContact, setSelectedContact] = useState<FamilyContact | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoriteFilter, setIsFavoriteFilter] = useState(false);
  
  // 통화 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);
  
  // 로컬스토리지 데이터 로드 시도
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined' || !user) return;
    
    try {
      const storedData = localStorage.getItem('silverHomeData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.users) {
            const currentUser = parsedData.users.find((u: UserData) => u.id === user.id);
            if (currentUser && currentUser.emergencyContacts && currentUser.emergencyContacts.length > 0) {
              setFamilyContacts(prev => {
                // 기존 샘플 데이터와 사용자 데이터 합치기
                const existingIds = prev.map(c => c.id);
                const newContacts = currentUser.emergencyContacts?.filter((c: FamilyContact) => !existingIds.includes(c.id)) || [];
                return [...prev, ...newContacts];
              });
            }
          }
        } catch (error) {
          console.error('데이터 파싱 오류:', error);
        }
      }
    } catch (error) {
      console.error('로컬스토리지 접근 오류:', error);
    }
  }, [user]);
  
  // 연락처 시작 함수
  const startCall = useCallback((contact: FamilyContact, type: 'video' | 'audio') => {
    setSelectedContact(contact);
    setActiveTab('call');
    setIsCallActive(true);
    setCallTimer(0);
  }, []);
  
  // 연락처 종료 함수
  const endCall = useCallback(() => {
    if (!selectedContact || !user) return;
    
    // 통화 기록에 추가
    const newCall: CallRecord = {
      id: `c${Date.now()}`,
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      type: 'video', // 기본값
      duration: callTimer,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setCallHistory(prev => [newCall, ...prev]);
    
    // 로컬스토리지 저장 시도
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const data = JSON.parse(storedData);
          const users = data.users || [];
          const userIndex = users.findIndex((u: UserData) => u.id === user.id);
          
          if (userIndex >= 0) {
            if (!users[userIndex].callHistory) users[userIndex].callHistory = [];
            users[userIndex].callHistory.unshift(newCall);
            localStorage.setItem('silverHomeData', JSON.stringify({...data, users}));
          }
        }
      }
    } catch (error) {
      console.error('통화 기록 저장 오류:', error);
    }
    
    setIsCallActive(false);
    setCallTimer(0);
    setActiveTab('contacts');
  }, [selectedContact, callTimer, user]);
  
  // 즐겨찾기 토글 함수
  const toggleFavorite = useCallback((contactId: string) => {
    setFamilyContacts(prev => {
      return prev.map(contact => {
        if (contact.id === contactId) {
          // 로컬스토리지 업데이트 시도
          try {
            if (typeof window !== 'undefined' && user) {
              const storedData = localStorage.getItem('silverHomeData');
              if (storedData) {
                const data = JSON.parse(storedData);
                const users = data.users || [];
                const userIndex = users.findIndex((u: UserData) => u.id === user.id);
                
                if (userIndex >= 0 && users[userIndex].emergencyContacts) {
                  const contactIndex = users[userIndex].emergencyContacts.findIndex((c: FamilyContact) => c.id === contactId);
                  if (contactIndex >= 0) {
                    users[userIndex].emergencyContacts[contactIndex].isFavorite = !contact.isFavorite;
                    localStorage.setItem('silverHomeData', JSON.stringify({...data, users}));
                  }
                }
              }
            }
          } catch (error) {
            console.error('즐겨찾기 업데이트 오류:', error);
          }
          
          return {...contact, isFavorite: !contact.isFavorite};
        }
        return contact;
      });
    });
  }, [user]);
  
  // 필터링된 연락처
  const filteredContacts = familyContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         contact.relationship.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = isFavoriteFilter ? contact.isFavorite : true;
    return matchesSearch && matchesFavorite;
  });
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return dateString;
    }
  };
  
  // 통화 시간 포맷 함수
  const formatCallDuration = (seconds: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* 탭 네비게이션 */}
        {!isCallActive && (
          <div className="bg-white shadow-md rounded-lg mb-6">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-4 px-4 text-center text-lg font-medium ${
                  activeTab === 'contacts' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUser className="inline mr-2" /> 연락처
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 px-4 text-center text-lg font-medium ${
                  activeTab === 'history' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaClock className="inline mr-2" /> 통화 기록
              </button>
            </nav>
          </div>
        )}
        
        {/* 연락처 페이지 */}
        {activeTab === 'contacts' && (
          <div className="bg-white shadow-md rounded-lg p-4">
            {/* 검색 및 필터 */}
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="grow relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="이름 또는 관계로 검색..."
                  className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isFavoriteFilter ? 'bg-red-50 text-red-600' : 'bg-white text-gray-700 border border-gray-300'}`}
                onClick={() => setIsFavoriteFilter(!isFavoriteFilter)}
              >
                <FaStar className={`mr-1 ${isFavoriteFilter ? 'text-yellow-400' : 'text-gray-400'}`} />
                즐겨찾기
              </button>
            </div>
            
            {/* 연락처 목록 */}
            <div className="space-y-3">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div key={contact.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(contact.id)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                      >
                        <FaStar className={contact.isFavorite ? 'text-yellow-400' : ''} />
                      </button>
                    </div>
                    <p className="text-gray-700 mb-3">{contact.phone}</p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startCall(contact, 'video')}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <FaVideo className="mr-2" /> 영상통화
                      </button>
                      <button
                        onClick={() => startCall(contact, 'audio')}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        <FaPhone className="mr-2" /> 음성통화
                      </button>
                    </div>
                    
                    {contact.lastCall && (
                      <p className="text-xs text-gray-500 mt-2">
                        <FaClock className="inline mr-1" /> 마지막 통화: {formatDate(contact.lastCall)}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || isFavoriteFilter ? 
                    '검색 결과가 없습니다.' : 
                    '등록된 연락처가 없습니다.'}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 통화 기록 페이지 */}
        {activeTab === 'history' && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="space-y-3">
              {callHistory.length > 0 ? (
                callHistory.map(call => (
                  <div key={call.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-900">{call.contactName}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${call.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {call.status === 'completed' ? '완료됨' : '부재중'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      {call.type === 'video' ? <FaVideo className="mr-1" /> : <FaPhone className="mr-1" />}
                      <span className="mr-2">{call.type === 'video' ? '영상통화' : '음성통화'}</span>
                      {call.status === 'completed' && (
                        <span>{formatCallDuration(call.duration)}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(call.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  통화 기록이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 통화 화면 */}
        {activeTab === 'call' && selectedContact && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-900 p-8 text-white">
              <div className="mb-8 text-center">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{selectedContact.name.charAt(0)}</span>
                </div>
                <h2 className="text-xl font-bold">{selectedContact.name}</h2>
                <p className="text-gray-300">{selectedContact.relationship}</p>
                <p className="mt-4 text-xl font-mono">{formatCallDuration(callTimer)}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={endCall}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full"
                >
                  <FaPhone className="transform rotate-135" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
