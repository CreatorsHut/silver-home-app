'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/data/models';

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  login: (id: string, password: string) => boolean;
  logout: () => void;
  register: (newUser: User) => boolean;
  isAdmin: () => boolean;
  isResident: () => boolean;
  isFamily: () => boolean;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 불러오기 및 초기 데이터 확인
  useEffect(() => {
    // 브라우저 환경에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      // 사용자 정보 불러오기
      const storedUser = localStorage.getItem('silverHomeUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('사용자 정보 파싱 오류:', e);
          localStorage.removeItem('silverHomeUser');
        }
      }
      
      // 초기 데이터가 로컬 스토리지에 없으면 초기화
      const storedData = localStorage.getItem('silverHomeData');
      if (!storedData) {
        try {
          // 데이터 모델에서 initialData 가져오기
          const { initialData } = require('@/data/models');
          localStorage.setItem('silverHomeData', JSON.stringify(initialData));
          console.log('초기 데이터가 로컬 스토리지에 설정되었습니다.');
        } catch (e) {
          console.error('초기 데이터 설정 오류:', e);
        }
      }
    }
  }, []);

  // 로그인 처리
  const login = (id: string, password: string): boolean => {
    // 브라우저 환경 확인
    if (typeof window === 'undefined') return false;
    
    try {
      // 실제 앱에서는 API 호출 대신 로컬 스토리지의 사용자 목록을 확인
      const storedData = localStorage.getItem('silverHomeData');
      if (!storedData) return false;
      
      const { users } = JSON.parse(storedData);
      const foundUser = users.find((u: User) => u.id === id && u.password === password);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('silverHomeUser', JSON.stringify(foundUser));
        return true;
      }
    } catch (e) {
      console.error('로그인 처리 오류:', e);
    }
    
    return false;
  };

  // 로그아웃 처리
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('silverHomeUser');
      // 직접 URL 변경으로 리디렉션 처리
      window.location.href = '/';
    }
  };

  // 관리자 확인
  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  // 입주자 확인
  const isResident = (): boolean => {
    return user?.role === 'resident';
  };

  // 가족 회원 확인
  const isFamily = (): boolean => {
    return user?.role === 'family';
  };

  // 회원가입 처리
  const register = (newUser: User): boolean => {
    // 브라우저 환경 확인
    if (typeof window === 'undefined') return false;
    
    try {
      // 로컬 스토리지에서 사용자 목록 확인
      const storedData = localStorage.getItem('silverHomeData');
      if (!storedData) return false;
      
      const data = JSON.parse(storedData);
      
      // ID 중복 확인
      const existingUser = data.users.find((u: User) => u.id === newUser.id);
      if (existingUser) return false;
      
      // 새 사용자 추가 (이 부분은 이제 register/page.tsx에서 처리함)
      return true;
    } catch (err) {
      console.error('회원가입 오류:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      register,
      isAdmin,
      isResident,
      isFamily
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
