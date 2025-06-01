'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { FaArrowLeft, FaUser, FaPaperPlane, FaSmile, FaImage, FaEllipsisH } from 'react-icons/fa';
import { ChatRoom, ChatMessage, getDataFromStorage, saveDataToStorage } from '@/data/models';

function ChatContent() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 스크롤을 항상 최신 메시지로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅방 데이터 로드
  useEffect(() => {
    // localStorage에서 채팅방 데이터 가져오기
    try {
      if (typeof window !== 'undefined') {
        const appData = getDataFromStorage();
        if (appData && appData.chatRooms) {
          setChatRooms(appData.chatRooms);
          setActiveRoomId(appData.chatRooms.length > 0 ? appData.chatRooms[0].id : null);
        }
      }
    } catch (err) {
      console.error('채팅방 데이터 로드 오류:', err);
      setError('채팅방 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);  // useEffect 의존성 제거

  // 선택된 채팅방 변경 시 메시지 로드
  useEffect(() => {
    if (!activeRoomId) return;
    
    // localStorage에서 채팅 메시지 가져오기
    try {
      if (typeof window !== 'undefined') {
        const appData = getDataFromStorage();
        if (appData && appData.chatMessages) {
          // 현재 선택된 채팅방의 메시지만 필터링
          const roomMessages = appData.chatMessages.filter(
            message => message.roomId === activeRoomId
          );
          
          // 메시지 시간순 정렬
          roomMessages.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          setMessages(roomMessages);
        }
      }
    } catch (err) {
      console.error('채팅 메시지 로드 오류:', err);
      setError('채팅 메시지를 불러오는데 실패했습니다.');
    }
    // 채팅방 선택 시 읽지 않은 메시지 수 초기화
    setChatRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === activeRoomId 
          ? { ...room, unreadCount: 0 } 
          : room
      )
    );
  }, [activeRoomId]);  // user 의존성 제거

  // 메시지 전송 핸들러
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoomId || !user) return;
    
    try {
      // 앱 데이터 가져오기
      const appData = getDataFromStorage();
      
      // 새 메시지 객체 생성
      const newMessageObj: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: true,
        roomId: activeRoomId
      };
      
      // 로컬 상태 업데이트
      setMessages(prev => [...prev, newMessageObj]);
      
      // 현재 채팅방의 마지막 메시지 업데이트
      const updatedRooms = chatRooms.map(room => {
        if (room.id === activeRoomId) {
          return {
            ...room,
            lastMessage: newMessage.trim(),
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0 // 현재 사용자가 보낸 메시지는 읽은 것으로 처리
          };
        }
        return room;
      });
      
      setChatRooms(updatedRooms);
      
      // 로컬 스토리지 업데이트
      if (typeof window !== 'undefined') {
        const updatedMessages = [...(appData?.chatMessages || []), newMessageObj];
        saveDataToStorage({
          ...appData,
          chatMessages: updatedMessages,
          chatRooms: updatedRooms
        });
      }
      
      // 메시지 입력창 초기화
      setNewMessage('');
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      alert('메시지 전송에 실패했습니다.');
    }
  };

  // 시간 포맷팅 함수
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // 채팅방 마지막 메시지 시간 포맷팅
  const formatLastMessageTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return `${days[date.getDay()]}요일`;
    } else {
      return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <FaArrowLeft className="mr-2" />
            <h1 className="text-2xl font-bold">커뮤니티 채팅</h1>
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

      <main className="flex-1 max-w-7xl mx-auto w-full">
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
          <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
            {/* 채팅방 목록 */}
            <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">채팅방</h2>
              </div>
              <ul>
                {chatRooms.map((room) => (
                  <li 
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                      activeRoomId === room.id ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-lg">
                        {room.name[0]}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-md font-medium text-gray-900">{room.name}</h3>
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(room.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate max-w-[150px]">
                            {room.lastMessage || '새로운 대화를 시작하세요'}
                          </p>
                          {room.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 채팅 메시지 */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {activeRoomId ? (
                <>
                  {/* 채팅방 헤더 */}
                  <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-lg">
                        {chatRooms.find(r => r.id === activeRoomId)?.name[0]}
                      </div>
                      <h2 className="ml-3 text-lg font-semibold text-gray-800">
                        {chatRooms.find(r => r.id === activeRoomId)?.name}
                      </h2>
                    </div>
                    
                    <button className="text-gray-500 hover:text-gray-700">
                      <FaEllipsisH />
                    </button>
                  </div>
                  
                  {/* 메시지 목록 */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.userId !== user?.id && (
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm">
                                {message.userName[0]}
                              </div>
                            </div>
                          )}
                          
                          <div className={`max-w-[70%]`}>
                            {message.userId !== user?.id && (
                              <p className="text-xs text-gray-600 mb-1">{message.userName}</p>
                            )}
                            
                            <div className="flex items-end">
                              {message.userId === user?.id && (
                                <span className="text-xs text-gray-500 mr-2">
                                  {formatMessageTime(message.timestamp)}
                                </span>
                              )}
                              
                              <div 
                                className={`py-2 px-4 rounded-lg ${
                                  message.userId === user?.id 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                              
                              {message.userId !== user?.id && (
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatMessageTime(message.timestamp)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  {/* 메시지 입력 */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <button 
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title="이모티콘"
                      >
                        <FaSmile />
                      </button>
                      <button 
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 mr-2"
                        title="이미지 첨부"
                      >
                        <FaImage />
                      </button>
                      
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요"
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                      
                      <button 
                        type="submit" 
                        className="ml-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                        disabled={!newMessage.trim()}
                      >
                        <FaPaperPlane />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">채팅방을 선택해주세요.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 채팅 페이지
export default function ChatPage() {
  return (
    <AuthWrapper>
      <ChatContent />
    </AuthWrapper>
  );
}
