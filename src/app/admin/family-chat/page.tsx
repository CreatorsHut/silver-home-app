'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
export const config = {
  dynamic: 'force-dynamic'
};

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import { getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaVideo, FaPhone, FaEnvelope, FaUserFriends, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AuthWrapper from '@/components/AuthWrapper';

// 가족 소통 관리 컨텐츠 컴포넌트
function FamilyChatContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useAppData();
  
  const [connections, setConnections] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  
  useEffect(() => {
    // 가족 소통 데이터 로드
    loadFamilyConnections();
    setIsLoading(false);
  }, []);
  
  // 가족 연결 데이터 로드 (임시 데이터)
  const loadFamilyConnections = () => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    // 실제로는 API 호출이나 데이터 저장소에서 가져올 것
    // localStorage에서 데이터를 가져오는 경우:
    // const appData = getDataFromStorage();
    // const storedConnections = appData.connections || [];
    
    // 임시 데이터 (데모용)
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
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    // 실제로는 API 호출이나 데이터 저장소에서 가져올 것
    // localStorage에서 데이터를 가져오는 경우:
    // const appData = getDataFromStorage();
    // const storedMessages = appData.messages || [];
    
    // 임시 데이터 (데모용)
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
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
      };
      return new Intl.DateTimeFormat('ko-KR', options).format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  // 연결 상태 변경
  const updateConnectionStatus = (connectionId: string, newStatus: 'active' | 'inactive') => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      const updatedConnections = connections.map(conn => {
        if (conn.id === connectionId) {
          return { ...conn, status: newStatus };
        }
        return conn;
      });
      
      setConnections(updatedConnections);
      
      // localStorage 업데이트 예시:
      // const appData = getDataFromStorage();
      // appData.connections = updatedConnections;
      // saveDataToStorage(appData);
      
      alert(`연결 상태가 ${newStatus === 'active' ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      console.error('연결 상태 변경 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 연결 삭제
  const deleteConnection = (connectionId: string) => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      if (window.confirm('정말 이 가족 연결을 삭제하시겠습니까? 모든 대화 내용이 삭제됩니다.')) {
        const updatedConnections = connections.filter(conn => conn.id !== connectionId);
        setConnections(updatedConnections);
        
        if (selectedConnection === connectionId) {
          setSelectedConnection(updatedConnections.length > 0 ? updatedConnections[0].id : null);
          if (updatedConnections.length > 0) {
            loadChatMessages(updatedConnections[0].id);
          } else {
            setMessages([]);
          }
        }
        
        // localStorage 업데이트 예시:
        // const appData = getDataFromStorage();
        // appData.connections = updatedConnections;
        // appData.messages = appData.messages.filter(msg => msg.connectionId !== connectionId);
        // saveDataToStorage(appData);
        
        alert('가족 연결이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('연결 삭제 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 메시지 전송
  const sendMessage = (message: string) => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      if (!selectedConnection || !message.trim()) return;
      
      const newMessage = {
        id: `msg-${Date.now()}`,
        connectionId: selectedConnection,
        senderId: 'admin',
        senderName: '관리자',
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      setMessages([...messages, newMessage]);
      
      // localStorage 업데이트 예시:
      // const appData = getDataFromStorage();
      // appData.messages = [...(appData.messages || []), newMessage];
      // saveDataToStorage(appData);
      
      // 메시지 입력 필드 초기화 (UI에서 처리)
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">가족 소통 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 가족 연결 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FaUserFriends className="mr-2 text-indigo-600" />
                가족 연결 목록
              </h2>
              <button 
                className="bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={() => alert('새 가족 연결 기능은 개발 중입니다.')}
              >
                <FaPlus className="mr-1" /> 새 연결
              </button>
            </div>
            
            {connections.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {connections.map((conn) => (
                  <li 
                    key={conn.id} 
                    className={`py-4 cursor-pointer ${selectedConnection === conn.id ? 'bg-gray-50' : ''}`}
                    onClick={() => loadChatMessages(conn.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {conn.residentName} ↔ {conn.familyName}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="mr-2">관계: {conn.relationship}</span>
                          <span>마지막 활동: {formatDate(conn.lastActivity)}</span>
                        </div>
                        <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          conn.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {conn.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button 
                          className="p-1 text-indigo-600 hover:text-indigo-900"
                          title="상세 보기"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadChatMessages(conn.id);
                          }}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="p-1 text-indigo-600 hover:text-indigo-900"
                          title={conn.status === 'active' ? '비활성화' : '활성화'}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateConnectionStatus(conn.id, conn.status === 'active' ? 'inactive' : 'active');
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:text-red-900"
                          title="삭제"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConnection(conn.id);
                          }}
                        >
                          <FaTrash />
                        </button>
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
                                : 'bg-indigo-600 text-white'
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
                    className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-md"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      sendMessage(input.value);
                      input.value = '';
                    }}
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
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈 관리자 시스템. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 인증된 관리자만 접근 가능한 가족 소통 관리 페이지
export default function FamilyChatManagementPage() {
  return (
    <AuthWrapper requiredRole="admin">
      <FamilyChatContent />
    </AuthWrapper>
  );
}
