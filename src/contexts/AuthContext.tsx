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
      console.log('초기화 useEffect 실행');
      
      // 저장된 데이터 확인 및 출력
      const storedData = localStorage.getItem('silverHomeData');
      console.log('현재 저장된 데이터:', storedData ? '있음' : '없음');
      
      // 사용자 정보 불러오기
      const storedUser = localStorage.getItem('silverHomeUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('저장된 사용자 정보 불러오기 성공:', parsedUser.id, parsedUser.role);
        } catch (e) {
          console.error('사용자 정보 파싱 오류:', e);
          localStorage.removeItem('silverHomeUser');
        }
      } else {
        console.log('저장된 사용자 정보 없음');
      }
      
      // 초기 데이터 설정 (항상 새로 설정)
      try {
        // 고정 초기 데이터 사용 (필수 필드 추가)
        const initialData = {
          users: [
            { id: 'admin', password: '1234', name: '관리자', role: 'admin', email: 'admin@silverhome.com', phone: '010-0000-0000' },
            { id: 'resident', password: '1234', name: '입주자', role: 'resident', email: 'resident@silverhome.com', phone: '010-0000-0000' },
            { id: 'family', password: '1234', name: '가족', role: 'family', email: 'family@silverhome.com', phone: '010-0000-0000' }
          ]
        };
        localStorage.setItem('silverHomeData', JSON.stringify(initialData));
        console.log('초기 데이터 설정 완료:', initialData.users.length, '명의 사용자');
        
        // 현재 저장된 데이터 확인
        const currentData = localStorage.getItem('silverHomeData');
        if (currentData) {
          const parsedData = JSON.parse(currentData);
          console.log('저장된 사용자 목록:', parsedData.users.map((u: any) => u.id).join(', '));
        }
      } catch (e) {
        console.error('초기 데이터 설정 오류:', e);
      }
    }
  }, []);

  // 로그인 처리
  const login = (id: string, password: string): boolean => {
    // 브라우저 환경 확인
    if (typeof window === 'undefined') {
      console.error('로그인 실패: 브라우저 환경 아님');
      return false;
    }
    
    console.log(`로그인 시도: ID="${id}", PW="${password}"`);
    
    try {
      // 테스트용 고정 사용자 로그인 처리 (임시 안정화 작업)
      if ((id === 'admin' && password === '1234') ||
          (id === 'resident' && password === '1234') ||
          (id === 'family' && password === '1234')) {
        
        // 사용자 역할 가져오기
        const role = id; // id가 role과 동일 (admin, resident, family)
        
        // 새 사용자 객체 생성 (필수 필드 추가)
        const user: User = {
          id,
          password,
          name: role === 'admin' ? '관리자' : (role === 'resident' ? '입주자' : '가족'),
          role,
          email: `${id}@silverhome.com`, // 기본 이메일
          phone: '010-0000-0000' // 기본 전화번호
        };
        
        console.log('사용자 정보 설정 중...', user.id, user.role);
        
        // 상태 및 로컬스토리지 업데이트
        setUser(user);
        localStorage.setItem('silverHomeUser', JSON.stringify(user));
        
        console.log('로그인 성공:', user.name, ', 역할:', user.role);
        return true;
      }
      
      // 기존 로직 (백업)
      // localStorage에서 사용자 목록 가져오기
      console.log('저장된 데이터에서 사용자 찾기 시도');
      const storedData = localStorage.getItem('silverHomeData');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('파싱된 데이터:', parsedData ? '성공' : '실패');
        
        if (parsedData && parsedData.users) {
          // 사용자 목록 정보 출력
          console.log('사용자 목록 개수:', parsedData.users.length);
          parsedData.users.forEach((u: User) => {
            console.log(`- 사용자: ID="${u.id}", Role="${u.role}"`);
          });
          
          // 사용자 찾기
          const foundUser = parsedData.users.find((u: User) => 
            u.id === id && u.password === password
          );
          
          if (foundUser) {
            console.log('사용자 찾음:', foundUser.id, foundUser.role);
            setUser(foundUser);
            localStorage.setItem('silverHomeUser', JSON.stringify(foundUser));
            return true;
          }
        }
      }
      
      console.log('로그인 실패: 사용자 정보 없음');
      return false;
    } catch (e) {
      console.error('로그인 처리 오류:', e);
      return false;
    }
  };

  // 로그아웃 처리
  const logout = () => {
    // 먼저 상태를 업데이트
    setUser(null);
    
    // 브라우저 환경인지 확인
    if (typeof window !== 'undefined') {
      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem('silverHomeUser');
      console.log('로그아웃 처리: 사용자 정보 삭제 완료');
      
      // 약간의 지연 후 홈페이지로 리디렉션 (동시 실행으로 인한 충돌 방지)
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
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
