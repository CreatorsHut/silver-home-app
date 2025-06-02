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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import { getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaVideo, FaPhone, FaEnvelope, FaUserFriends, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function FamilyChatManagementPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { data } = useAppData();
  
  const [connections, setConnections] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  
  // 관리자 권한 확인 및 리디렉션
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      try {
        if (!user) {
          router.push('/login');
          return;
        }
        
        if (!isAdmin()) {
          router.push('/dashboard');
          return;
        }
        
        // 가족 소통 데이터 로드 (예시)
        loadFamilyConnections();
      } catch (error) {
        console.error('가족 소통 관리 페이지 접근 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, router, isAdmin]);
  
  // 가족 연결 데이터 로드 (임시 데이터)
  const loadFamilyConnections = () => {
    // 실제로는 API 호출이나 데이터 저장소에서 가져올 것
    const dummyConnections = [
      {
        id: 'conn-1',
        residentId: 'resident-1',
        residentName: '홍길동',
        familyId: 'family-1',
        familyName: '홍아들',
        relationship: '아들',
        lastActivity: '2025-05-30T14:23:00Z',
        status: 'active'
      },
      {
        id: 'conn-2',
        residentId: 'resident-2',
        residentName: '이순신',
        familyId: 'family-2',
        familyName: '이딸',
        relationship: '딸',
        lastActivity: '2025-05-29T09:15:00Z',
        status: 'active'
      },
      {
        id: 'conn-3',
        residentId: 'resident-3',
        residentName: '김철수',
        familyId: 'family-3',
        familyName: '김손자',
        relationship: '손자',
        lastActivity: '2025-05-28T16:45:00Z',
        status: 'inactive'
      }
    ];
    
    setConnections(dummyConnections);
    
    // 메시지 샘플 데이터
    if (dummyConnections.length > 0) {
      loadChatMessages(dummyConnections[0].id);
      setSelectedConnection(dummyConnections[0].id);
    }
  };
  
  // 채팅 메시지 로드 (임시 데이터)
  const loadChatMessages = (connectionId: string) => {
    // 실제로는 API 호출이나 데이터 저장소에서 가져올 것
    const dummyMessages = [
      {
        id: 'msg-1',
        connectionId: 'conn-1',
        senderId: 'resident-1',
        senderName: '홍길동',
        content: '오늘 저녁 식사는 뭐예요?',
        timestamp: '2025-05-30T14:20:00Z',
        isRead: true
      },
      {
        id: 'msg-2',
        connectionId: 'conn-1',
        senderId: 'family-1',
        senderName: '홍아들',
        content: '오늘은 갈비찜 먹을 거예요. 엄마가 만들어요.',
        timestamp: '2025-05-30T14:22:00Z',
        isRead: true
      },
      {
        id: 'msg-3',
        connectionId: 'conn-1',
        senderId: 'resident-1',
        senderName: '홍길동',
        content: '좋아요! 맛있겠네요.',
        timestamp: '2025-05-30T14:23:00Z',
        isRead: false
      }
    ];
    
    const filteredMessages = dummyMessages.filter(msg => msg.connectionId === connectionId);
    setMessages(filteredMessages);
    setSelectedConnection(connectionId);
  };
  
  // 날짜 포맷팅 헬퍼 함수
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
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="mr-4 text-red-600 hover:text-red-800">
          <FaArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">가족 소통 관리</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 가족 연결 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">입주자-가족 연결 목록</h2>
          
          {connections.length > 0 ? (
            <ul className="divide-y">
              {connections.map((conn) => (
                <li 
                  key={conn.id} 
                  className={`py-3 cursor-pointer hover:bg-gray-50 ${selectedConnection === conn.id ? 'bg-gray-100' : ''}`}
                  onClick={() => loadChatMessages(conn.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{conn.residentName}</div>
                      <div className="text-sm text-gray-600">
                        {conn.familyName} ({conn.relationship})
                      </div>
                      <div className="text-xs text-gray-500">
                        최근 활동: {formatDate(conn.lastActivity)}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        conn.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {conn.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              등록된 가족 연결이 없습니다.
            </div>
          )}
        </div>
        
        {/* 오른쪽: 메시지 내역 */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">메시지 내역</h2>
            <div className="flex space-x-2">
              <button 
                className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={() => alert('화상 통화 기능은 개발 중입니다.')}
              >
                <FaVideo className="mr-1" /> 화상 통화
              </button>
              <button 
                className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={() => alert('음성 통화 기능은 개발 중입니다.')}
              >
                <FaPhone className="mr-1" /> 음성 통화
              </button>
            </div>
          </div>
          
          {selectedConnection ? (
            <>
              <div className="border rounded-lg mb-4 h-96 overflow-y-auto p-4 bg-gray-50">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderId.includes('resident') ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                            message.senderId.includes('resident') 
                              ? 'bg-gray-200 text-gray-800' 
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          <div className="text-xs mb-1">
                            {message.senderName} • {formatDate(message.timestamp)}
                          </div>
                          <div>{message.content}</div>
                          {message.isRead && (
                            <div className="text-xs text-right mt-1">
                              {message.senderId.includes('resident') ? '전송됨' : '읽음'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    메시지 내역이 없습니다.
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="관리자 메시지 입력..." 
                  className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded-r-md"
                  onClick={() => alert('메시지 전송 기능은 개발 중입니다.')}
                >
                  전송
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              왼쪽에서 대화를 선택하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
