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
      // 인증 상태 확인 시간을 주기 위한 지연
      const timer = setTimeout(() => {
        // 사용자가 로그인하지 않은 경우
        if (!user) {
          router.push('/login');
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
            router.push('/dashboard');
            return;
          }
        }
        
        setIsAuthorized(true);
        setIsLoading(false);
      }, 500); // 500ms 지연
      
      return () => clearTimeout(timer);
    }
  }, [user, router, isAdmin, isResident, isFamily, requiredRole]);

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
