'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { useAppData } from '@/contexts/AppContext';
import { getDataFromStorage, saveDataToStorage, Message, Conversation } from '@/data/models';
import { FaArrowLeft, FaPaperPlane, FaUser, FaImage, FaSmile, FaEllipsisV, FaPhone, FaVideo } from 'react-icons/fa';

// models.ts에서 임포트한 Message와 Conversation 인터페이스 사용

function FamilyChatContent() {
  const { user, isFamily, isResident } = useAuth();
  const { data, updateConversation } = useAppData();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  
  // 사용자 인증 체크는 AuthWrapper에서 처리
  useEffect(() => {
    // 가족 또는 입주자만 접근 가능
    if (typeof window !== 'undefined' && user && !isFamily() && !isResident()) {
      window.location.href = '/dashboard';
      return;
    }
  }, [user, isFamily, isResident]);
  
  // 채팅 데이터 로드
  useEffect(() => {
    if (!user) return;
    
    try {
      // 로컬 스토리지에서 최신 데이터 가져오기
      const appData = getDataFromStorage();
      
      // conversations 배열이 없으면 초기화
      if (!appData.conversations) {
        appData.conversations = [];
        saveDataToStorage(appData);
      }
      
      // 사용자의 대화만 필터링
      const userId = user?.id;
      if (!userId) {
        setConversations([]);
        return;
      }
      
      try {
        // 각 대화에 대해 안전하게 처리
        let validConversations: Conversation[] = [];
        
        if (Array.isArray(appData.conversations)) {
          // 1. 유효한 대화만 필터링
          validConversations = appData.conversations.filter(conv => {
            if (!conv || typeof conv !== 'object') return false;
            if (!Array.isArray(conv.participants)) return false;
            if (!conv.participants.includes(userId)) return false;
            return true;
          });
          
          // 2. 각 대화의 메시지 배열 확인 및 초기화
          validConversations = validConversations.map(conv => {
            if (!Array.isArray(conv.messages)) {
              return {
                ...conv,
                messages: []
              };
            }
            return conv;
          });
          
          // 3. 수정된 데이터 저장 (업데이트가 있었을 경우)
          const originalLength = appData.conversations.length;
          if (validConversations.length < originalLength) {
            appData.conversations = validConversations;
            saveDataToStorage(appData);
            console.log('유효하지 않은 데이터 수정함');
          }
          
          // 4. 마지막 메시지 시간 기준 정렬
          validConversations.sort((a, b) => {
            // null/undefined 확인
            const timeA = a && a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
            const timeB = b && b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
            return timeB - timeA;
          });
          
          setConversations(validConversations);
          
          // 5. 활성 대화 설정
          if (validConversations.length > 0 && !activeConversation) {
            setActiveConversation(validConversations[0]);
          }
        } else {
          // 대화 배열이 유효하지 않으면 초기화
          setConversations([]);
          appData.conversations = [];
          saveDataToStorage(appData);
        }
      } catch (err) {
        console.error('대화 처리 중 오류:', err);
        setConversations([]);
      }
    } catch (err) {
      console.error('대화 데이터 로드 오류:', err);
      setConversations([]);
    }
    
    // 가족 구성원 목록 가져오기
    try {
      if (!user || !user.id) {
        console.log('사용자 정보 없음');
        setFamilyMembers([]);
        return;
      }
      
      // 로컬 스토리지에서 최신 데이터 가져오기
      const appData = getDataFromStorage();
      
      // 데이터 형식 및 초기화 확인
      if (!Array.isArray(appData.users)) {
        console.log('users 배열 초기화');
        appData.users = [];
        saveDataToStorage(appData);
      }
      
      if (!Array.isArray(appData.familyConnections)) {
        console.log('familyConnections 배열 초기화');
        appData.familyConnections = [];
        saveDataToStorage(appData);
      }
      
      // 유효한 데이터만 추출
      const users = (appData.users || []).filter(u => u && typeof u === 'object' && u.id && u.role);
      const familyConnections = (appData.familyConnections || []).filter(conn => 
        conn && typeof conn === 'object' && conn.familyId && conn.residentId
      );
      
      // 가족 회원이면 입주자 목록, 입주자면 가족 목록 가져오기
      let relevantUsers: any[] = [];
      
      if (isFamily() && user.id) {
        // 가족 회원인 경우, 연결된 입주자 찾기
        const connections = familyConnections.filter(conn => conn.familyId === user.id);
        const residentIds = connections.map(conn => conn.residentId).filter(id => id && typeof id === 'string');
        
        if (residentIds.length === 0) {
          console.log('연결된 입주자 없음');
          // 임시 테스트 목적으로, 모든 입주자 표시 (개발용)
          relevantUsers = users.filter(u => u.role === 'resident');
        } else {
          relevantUsers = users.filter(u => 
            u.role === 'resident' && residentIds.includes(u.id)
          );
        }
      } else if (isResident() && user.id) {
        // 입주자인 경우, 연결된 가족 구성원 찾기
        const connections = familyConnections.filter(conn => conn.residentId === user.id);
        const familyIds = connections.map(conn => conn.familyId).filter(id => id && typeof id === 'string');
        
        if (familyIds.length === 0) {
          console.log('연결된 가족 구성원 없음');
          // 임시 테스트 목적으로, 모든 가족 표시 (개발용)
          relevantUsers = users.filter(u => u.role === 'family');
        } else {
          relevantUsers = users.filter(u => 
            u.role === 'family' && familyIds.includes(u.id)
          );
        }
      }
      
      console.log('가족 구성원 목록:', relevantUsers.length);
      
      setFamilyMembers(relevantUsers);
      
      // 로컬 스토리지 데이터 업데이트 (초기화를 했다면)
      saveDataToStorage(appData);
    } catch (err) {
      console.error('가족 구성원 목록 가져오기 오류:', err);
      setFamilyMembers([]);
    }
  }, [user, isFamily, isResident, activeConversation]);
  
  // 스크롤 최하단으로 이동
  useEffect(() => {
    if (messagesEndRef.current && activeConversation?.messages?.length) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages?.length]);
  
  // 메시지 전송
  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !user) return;
    
    try {
      const message = {
        senderId: user.id,
        senderName: user.name || '사용자',
        content: newMessage,
        isRead: false
      };
      
      // 1. UI 업데이트 - 로컬 상태 변경
      const newMsg: Message = {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      const updatedConversation = {
        ...activeConversation,
        messages: [...(activeConversation.messages || []), newMsg],
        lastMessageTime: newMsg.timestamp
      };
      
      const updatedConversations = conversations.map(conv => 
        conv.id === activeConversation.id ? updatedConversation : conv
      );
      
      setActiveConversation(updatedConversation);
      setConversations(updatedConversations);
      setNewMessage('');
      
      // 2. 로컬 스토리지 업데이트
      try {
        // 최신 데이터 가져오기
        const appData = getDataFromStorage();
        
        // conversations 없으면 초기화
        if (!Array.isArray(appData.conversations)) {
          appData.conversations = [];
        }
        
        // 기존 대화 업데이트 또는 새 대화 추가
        const existingConvIndex = appData.conversations.findIndex(conv => 
          conv && typeof conv === 'object' && conv.id === activeConversation.id
        );
        
        if (existingConvIndex >= 0) {
          // 대화가 존재하면 업데이트
          const conv = appData.conversations[existingConvIndex];
          if (!Array.isArray(conv.messages)) {
            conv.messages = [];
          }
          
          conv.messages.push(newMsg);
          conv.lastMessageTime = newMsg.timestamp;
          appData.conversations[existingConvIndex] = conv;
        } else {
          // 없으면 새로 추가
          appData.conversations.push(updatedConversation);
        }
        
        // 데이터 저장
        saveDataToStorage(appData);
      } catch (err) {
        console.error('로컬 스토리지 업데이트 오류:', err);
      }
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      alert('메시지 전송 중 오류가 발생했습니다.');
    }
  };
  
  // 대화 선택
  const selectConversation = (conversation: Conversation) => {
    if (!conversation) return;
    setActiveConversation(conversation);
  };
  
  // 새 대화 시작
  const startNewConversation = (memberId: string, memberName: string) => {
    if (!user || !memberId) {
      console.error('사용자 또는 대화 상대가 없습니다.');
      return;
    }
    
    try {
      // 이미 대화가 있는지 확인
      const existingConv = conversations.find(conv => {
        if (!conv || !Array.isArray(conv.participants)) return false;
        
        return (
          conv.participants.includes(memberId) && 
          conv.participants.includes(user.id) &&
          conv.participants.length === 2
        );
      });
      
      if (existingConv) {
        setActiveConversation(existingConv);
        return;
      }
      
      // 새 대화 생성
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participants: [user.id, memberId],
        lastMessageTime: new Date().toISOString(),
        messages: []
      };
      
      // 대화 목록에 추가 (UI 상태 업데이트)
      const updatedConversations = [newConversation, ...conversations];
      setConversations(updatedConversations);
      setActiveConversation(newConversation);
      
      // 로컬 스토리지 업데이트
      try {
        // 최신 데이터 가져오기
        const appData = getDataFromStorage();
        
        // conversations 배열 확인 및 초기화
        if (!Array.isArray(appData.conversations)) {
          appData.conversations = [];
        }
        
        // 새 대화 추가 (중복 방지)
        const exists = appData.conversations.some(conv => 
          conv && typeof conv === 'object' && conv.id === newConversation.id
        );
        
        if (!exists) {
          appData.conversations = [newConversation, ...appData.conversations];
          // 데이터 저장
          saveDataToStorage(appData);
        }
      } catch (err) {
        console.error('로컬 스토리지 업데이트 오류:', err);
      }
    } catch (err) {
      console.error('새 대화 시작 오류:', err);
      alert('대화 생성 중 오류가 발생했습니다.');
    }
  };
  
  // 날짜 포맷팅
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    }
    
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // 상대방 이름 찾기
  const getOtherParticipantName = (conversation: Conversation) => {
    if (!user || !conversation || !conversation.participants) return '알 수 없음';
    
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    if (!otherParticipantId) return '알 수 없음';
    
    const otherUser = data?.users?.find(u => u && u.id === otherParticipantId);
    return otherUser?.name || '알 수 없음';
  };
  
  // 메시지 그룹핑
  const groupMessagesByDate = (messages: Message[]) => {
    if (!messages || messages.length === 0) return [];
    
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: { date: string; messages: Message[] } | null = null;
    
    messages.forEach(message => {
      if (!message || !message.timestamp) return;
      
      const messageDate = formatDate(message.timestamp);
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        currentGroup = { date: currentDate, messages: [] };
        groups.push(currentGroup);
      }
      
      if (currentGroup) {
        currentGroup.messages.push(message);
      }
    });
    
    return groups;
  };
  
  // 사용자 인증 체크
  if (!user || (!isFamily() && !isResident())) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">가족 채팅</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* 채팅 목록 사이드바 */}
        <div className="w-1/3 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">채팅</h2>
          </div>
          
          {/* 가족 구성원 목록 */}
          {familyMembers.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {isFamily() ? '입주자 목록' : '가족 구성원'}
              </h3>
              <div className="flex-1 border-r overflow-y-auto">
                {familyMembers && familyMembers.map((member: any) => (
                  <div 
                    key={member.id}
                    onClick={() => startNewConversation(member.id, member.name)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <FaUser className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name || '사용자'}</p>
                      <p className="text-sm text-gray-500">{member.role === 'resident' ? '입주자' : '가족'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 대화 목록 */}
          <div>
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <div 
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    activeConversation?.id === conversation.id ? 'bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-gray-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{getOtherParticipantName(conversation)}</span>
                        {conversation?.messages?.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation?.lastMessageTime || '')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation?.messages?.length > 0
                          ? conversation.messages[conversation.messages.length - 1]?.content || ''
                          : '새로운 대화를 시작하세요'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>대화 내역이 없습니다.</p>
                <p className="text-sm mt-2">가족 구성원과 대화를 시작해보세요.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 채팅 영역 */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {activeConversation ? (
            <>
              {/* 채팅 헤더 */}
              <div className="bg-white p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{getOtherParticipantName(activeConversation)}</h3>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className="text-gray-600 hover:text-gray-800">
                    <FaPhone />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <FaVideo />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <FaEllipsisV />
                  </button>
                </div>
              </div>
              
              {/* 채팅 메시지 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeConversation?.messages?.length > 0 ? (
                  groupMessagesByDate(activeConversation?.messages || []).map((group, idx) => (
                    <div key={idx} className="mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                          {group.date}
                        </div>
                      </div>
                      
                      {group.messages?.map(message => (
                        <div key={message?.id} className={`flex ${user && message?.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-4`}>
                          {user && message?.senderId !== user?.id && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                              <FaUser className="text-gray-500 text-xs" />
                            </div>
                          )}
                          <div className={`max-w-[70%]`}>
                            {user && message?.senderId !== user?.id && (
                              <p className="text-xs text-gray-600 mb-1">{message?.senderName || ''}</p>
                            )}
                            <div className="flex items-end">
                              {user && message?.senderId !== user?.id && (
                                <div className={`rounded-lg py-2 px-3 bg-white text-gray-800`}>
                                  {message?.content || ''}
                                </div>
                              )}
                              {user && message?.senderId === user?.id && (
                                <div className={`rounded-lg py-2 px-3 bg-red-500 text-white`}>
                                  {message?.content || ''}
                                </div>
                              )}
                              <span className="text-xs text-gray-500 ml-2">
                                {formatTime(message?.timestamp || '')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <p className="mb-2">아직 대화 내용이 없습니다.</p>
                      <p className="text-sm">첫 메시지를 보내보세요!</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* 메시지 입력 영역 */}
              <div className="bg-white p-4 border-t">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-gray-700 mr-2">
                    <FaImage />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 mr-4">
                    <FaSmile />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${
                      newMessage.trim() ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">대화를 선택해주세요</p>
                <p className="text-sm">왼쪽에서 대화를 선택하거나 새 대화를 시작하세요.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 가족 채팅 페이지
export default function FamilyChatPage() {
  return (
    <AuthWrapper>
      <FamilyChatContent />
    </AuthWrapper>
  );
}
