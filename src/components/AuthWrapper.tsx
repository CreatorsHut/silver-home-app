'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: ReactNode;
  // 새로운 API - 개별 권한 지정
  requireAdmin?: boolean;
  requireResident?: boolean;
  requireFamily?: boolean;
  // 이전 API와의 호환성
  requiredRole?: 'admin' | 'resident' | 'family';
}

/**
 * 인증 및 권한 확인을 위한 컴포넌트
 * - 로그인 여부 체크
 * - 역할 기반 접근 제어 (RBAC)
 * - 리디렉션 로직 개선 (무한 리디렉션 방지)
 */
export default function AuthWrapper({
  children,
  requireAdmin = false,
  requireResident = false,
  requireFamily = false,
  requiredRole,
}: AuthWrapperProps): React.ReactElement | null {
  const { user, isAdmin, isResident, isFamily } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // SSR에서는 실행하지 않음
    if (typeof window === 'undefined') return;

    console.log('AuthWrapper 초기화 - 사용자 인증 상태 확인');

    // 현재 경로 확인
    const currentPath = window.location.pathname;
    console.log('현재 경로:', currentPath);
    
    // 로그인 페이지 예외 처리
    if (currentPath === '/login') {
      console.log('로그인 페이지에 있음 - 권한 검사 없이 허용');
      setIsChecking(false);
      setIsAuthorized(true);
      return;
    }

    // 리디렉션 방지 쿠키 확인
    const preventRedirect = document.cookie.includes('preventLoginRedirect=true');
    console.log('리디렉션 방지 쿠키:', preventRedirect ? '있음' : '없음');

    // localStorage에서 사용자 정보 직접 확인 (추가 안정성)
    let storedUser = null;
    try {
      const storedUserJson = localStorage.getItem('silverHomeUser');
      if (storedUserJson) {
        storedUser = JSON.parse(storedUserJson);
        console.log('localStorage 사용자 정보 확인:', storedUser.id, storedUser.role);
      }
    } catch (e) {
      console.error('localStorage 사용자 정보 파싱 오류:', e);
    }

    // 사용자 정보가 없고 쿠키로 리디렉션 방지 설정되지 않은 경우
    if (!user && !storedUser && !preventRedirect) {
      console.log('인증되지 않은 사용자: 로그인 페이지로 이동');
      window.location.href = '/login';
      return;
    }

    // 사용자 정보 확인 (컨텍스트 또는 localStorage)
    const effectiveUser = user || storedUser;

    // 권한 확인
    let authorized = true;
    const role = effectiveUser?.role || '';
    
    // 사용자 역할 확인 함수
    const checkIsAdmin = () => role === 'admin';
    const checkIsResident = () => role === 'resident';
    const checkIsFamily = () => role === 'family';
    
    // 이전 API requiredRole 처리
    if (requiredRole) {
      if (requiredRole === 'admin' && !checkIsAdmin()) {
        authorized = false;
      } else if (requiredRole === 'resident' && !checkIsResident()) {
        authorized = false;
      } else if (requiredRole === 'family' && !checkIsFamily()) {
        authorized = false;
      }
    } 
    // 새로운 API 처리 
    else {
      if (requireAdmin && !checkIsAdmin()) {
        authorized = false;
      }
      
      if (requireResident && !checkIsResident()) {
        authorized = false;
      }
      
      if (requireFamily && !checkIsFamily()) {
        authorized = false;
      }
    }

    // 권한 없음 처리
    if (!authorized) {
      console.log('권한 부족: 대시보드로 이동');
      window.location.href = '/dashboard';
      return;
    }
    
    // 인증 및 권한 확인 완료
    console.log('인증 및 권한 확인 완료, 페이지 렌더링 시작');
    setIsAuthorized(true);
    setIsChecking(false);
  }, [user, requireAdmin, requireResident, requireFamily, requiredRole, isAdmin, isResident, isFamily]);

  // 인증 확인 중 로딩 표시
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증 성공 시 자식 컴포넌트 렌더링
  return <>{children}</>;
}
