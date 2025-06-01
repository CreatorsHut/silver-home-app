'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppData, 
  initialData, 
  getDataFromStorage, 
  saveDataToStorage,
  Request,
  EmergencyCall,
  Message,
  Conversation
} from '@/data/models';

// 컨텍스트에서 제공할 값의 타입 정의
interface AppContextType {
  data: AppData;
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'status'>) => void;
  addEmergencyCall: (call: Omit<EmergencyCall, 'id' | 'timestamp'>) => void;
  bookFacility: (booking: {
    facilityId: string;
    userId: string;
    userName: string;
    slot: string;
    date?: string;
  }) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addConversation: (conversation: Omit<Conversation, 'id' | 'lastMessageTime'>) => void;
  updateConversation: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
}

// 앱 컨텍스트 생성
const AppContext = createContext<AppContextType | undefined>(undefined);

// 앱 컨텍스트 프로바이더 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  
  // 컴포넌트 마운트시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const storedData = getDataFromStorage();
    setData(storedData);
  }, []);
  
  // 데이터 변경시 로컬 스토리지에 저장
  useEffect(() => {
    saveDataToStorage(data);
  }, [data]);
  
  // 생활 도움 요청 추가
  const addRequest = (request: Omit<Request, 'id' | 'createdAt' | 'status'>) => {
    setData(prev => ({
      ...prev,
      requests: [...prev.requests, { 
        id: `request-${Date.now()}`, 
        createdAt: new Date().toISOString(),
        status: 'pending',
        ...request 
      }]
    }));
  };
  
  // 긴급 호출 추가
  const addEmergencyCall = (call: Omit<EmergencyCall, 'id' | 'timestamp'>) => {
    setData(prev => ({
      ...prev,
      emergencyCalls: [...prev.emergencyCalls, { 
        id: `emergency-${Date.now()}`, 
        timestamp: new Date().toISOString(),
        ...call 
      }]
    }));
  };
  
  // 공용 시설 예약
  const bookFacility = (booking: {
    facilityId: string;
    userId: string;
    userName: string;
    slot: string;
    date?: string;
  }) => {
    setData(prev => {
      const updatedFacilities = prev.facilities.map(facility => {
        if (facility.id === booking.facilityId) {
          return {
            ...facility,
            bookings: [...facility.bookings, {
              id: `booking-${Date.now()}`,
              userId: booking.userId,
              userName: booking.userName,
              slot: booking.slot,
              date: booking.date || new Date().toISOString().split('T')[0]
            }]
          };
        }
        return facility;
      });
      
      return {
        ...prev,
        facilities: updatedFacilities
      };
    });
  };
  
  // 커뮤니티 메시지 추가
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setData(prev => ({
      ...prev,
      messages: [...prev.messages, { 
        id: `message-${Date.now()}`, 
        timestamp: new Date().toISOString(),
        ...message 
      }]
    }));
  };
  
  // 새 대화 추가
  const addConversation = (conversation: Omit<Conversation, 'id' | 'lastMessageTime'>) => {
    setData(prev => {
      // 이미 존재하는 대화인지 확인
      const existingConv = prev.conversations?.find(conv => 
        conv.participants.length === conversation.participants.length && 
        conv.participants.every(p => conversation.participants.includes(p))
      );

      if (existingConv) return prev; // 이미 존재하면 변경 없음

      // 새 대화 추가
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        lastMessageTime: new Date().toISOString(),
        ...conversation
      };

      return {
        ...prev,
        conversations: [...(prev.conversations || []), newConversation]
      };
    });
  };

  // 대화에 메시지 추가 및 업데이트
  const updateConversation = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    setData(prev => {
      const newMessage = {
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...message
      };

      const now = new Date().toISOString();
      
      // 대화 업데이트
      const updatedConversations = prev.conversations?.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...(conv.messages || []), newMessage],
            lastMessageTime: now
          };
        }
        return conv;
      }) || [];

      return {
        ...prev,
        conversations: updatedConversations
      };
    });
  };

  return (
    <AppContext.Provider value={{ 
      data,
      addRequest,
      addEmergencyCall,
      bookFacility,
      addMessage,
      addConversation,
      updateConversation
    }}>
      {children}
    </AppContext.Provider>
  );
}

// 앱 컨텍스트 사용을 위한 커스텀 훅
export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
};
