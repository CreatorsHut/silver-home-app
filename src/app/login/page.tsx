'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
export const config = {
  runtime: 'edge',
  regions: ['icn1'],
  dynamic: 'force-dynamic'
};

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  // 테스트 계정 로그인 함수
  const fillTestAccount = (type: string) => {
    console.log(`테스트 계정 선택: ${type}`);
    
    if (isLoading) {
      console.log('이미 로그인 처리 중, 테스트 계정 선택 무시');
      return;
    }
    
    // 테스트 계정 정보 설정
    if (type === 'admin') {
      setId('admin');
      setPassword('1234');
    } else if (type === 'resident') {
      setId('resident');
      setPassword('1234');
    } else if (type === 'family') {
      setId('family');
      setPassword('1234');
    }
    
    console.log(`테스트 계정 설정 완료: ${type}, ID: ${type}`);
  };
  
  useEffect(() => {
    // 무한 리디렉션 방지를 위한 로그 추가
    console.log('로그인 페이지 마운트. 로그인 상태 확인 중...');
    
    // 로컬스토리지 확인은 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
      // 리디렉션 방지 쿠키 검사
      const preventRedirect = document.cookie.includes('preventLoginRedirect=true');
      if (preventRedirect) {
        console.log('리디렉션 방지 쿠키 발견, 리디렉션 취소');
        // 쿠키 삭제
        document.cookie = 'preventLoginRedirect=true; max-age=0; path=/';
      }
    }
  }, []);
  
  // 로그인 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('로그인 시도 - ID:', id);
    
    // 폼 검증
    if (!id || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    // 이미 로그인 처리 중이라면 중복 시도 방지
    if (isLoading) {
      console.log('이미 로그인 처리 중');
      return;
    }
    
    // 로딩 시작
    setIsLoading(true);
    
    try {
      // 로그인 시도
      console.log('로그인 함수 호출 전');
      const success = login(id, password);
      console.log('로그인 함수 결과:', success);
      
      if (success) {
        console.log('로그인 성공 - 대시보드로 이동 시도');
        
        // 리디렉션 방지 쿠키 설정 - 더 긴 유효 시간과 secure 속성 제거
        const expires = new Date();
        expires.setTime(expires.getTime() + 10000); // 10초 유효
        document.cookie = `preventLoginRedirect=true; expires=${expires.toUTCString()}; path=/`;
        
        console.log('리디렉션 방지 쿠키 설정 완료:', document.cookie);
        
        // 지연 시간 증가
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            // localStorage에 사용자 정보가 제대로 저장되었는지 한 번 더 확인
            try {
              const storedUser = localStorage.getItem('silverHomeUser');
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                console.log('리디렉션 전 저장된 사용자 확인:', userData.id, userData.role);
              } else {
                console.warn('리디렉션 전 사용자 정보가 localStorage에 없음');
              }
            } catch (e) {
              console.error('localStorage 검사 오류:', e);
            }
            
            console.log('리디렉션 실행 중: /dashboard');
            window.location.href = '/dashboard';
          }
        }, 500);
      } else {
        console.log('로그인 실패');
        setIsLoading(false);
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setIsLoading(false);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };
  
  // 경고: 여기에 중복된 fillTestAccount 함수가 있었음

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h1 className="text-center text-4xl font-bold text-red-600 cursor-pointer">실버홈</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          계정이 없으신가요? {' '}
          <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
            회원가입하기
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="id" className="block text-xl font-medium text-gray-700">
                아이디
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="id"
                  name="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="아이디 입력"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="비밀번호 입력"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
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
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 text-lg">테스트 계정으로 로그인</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => fillTestAccount('resident')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                입주자 계정
              </button>
              <button
                onClick={() => fillTestAccount('family')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                가족 계정
              </button>
              <button
                onClick={() => fillTestAccount('admin')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                관리자 계정
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
