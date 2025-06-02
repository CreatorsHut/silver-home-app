'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'resident' | 'family'; // 필요한 역할을 지정할 수 있음
}

export default function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const { user, isAdmin, isResident, isFamily } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        // 먼저 로딩 상태를 true로 설정
        setIsLoading(true);
        
        // 현재 경로가 로그인 페이지일 경우 리디렉션 방지
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath === '/login';
        
        // 사용자가 로그인하지 않은 경우
        if (!user) {
          console.log('로그인 상태 아님:', currentPath);
          
          // 로그인 페이지가 아닐 경우에만 리디렉션
          if (!isLoginPage) {
            console.log('로그인 페이지로 리디렉션');
            window.location.href = '/login';
          }
          return;
        }

        // 특정 역할이 필요한 경우 권한 확인
        if (requiredRole) {
          let hasRequiredRole = false;
          
          if (requiredRole === 'admin' && isAdmin()) {
            hasRequiredRole = true;
          } else if (requiredRole === 'resident' && isResident()) {
            hasRequiredRole = true;
          } else if (requiredRole === 'family' && isFamily()) {
            hasRequiredRole = true;
          }
          
          if (!hasRequiredRole) {
            console.log(`필요한 권한 없음(${requiredRole}): 대시보드로 리디렉션`);
            window.location.href = '/dashboard';
            return;
          }
        }
        
        // 인증 및 권한 확인 모두 통과
        console.log('인증 성공: 컨텐츠 렌더링');
        setIsAuthorized(true);
        setIsLoading(false);
      };
      
      // 실행
      checkAuth();
    }
  }, [user, isAdmin, isResident, isFamily, requiredRole]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // 인증 실패 시 (리다이렉트 처리 중)
  if (!isAuthorized) {
    return null;
  }

  // 인증 성공 시 자식 컴포넌트 렌더링
  return <>{children}</>;
}
