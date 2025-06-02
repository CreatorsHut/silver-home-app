'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기
export const config = {
  dynamic: 'force-dynamic'
};

// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();
  
  // 이미 로그인되어 있는지 한 번만 확인
  useEffect(() => {
    // 이 플래그는 한 번만 실행되도록 함
    let isRedirecting = false;
    
    if (typeof window !== 'undefined' && !isRedirecting) {
      try {
        const storedUser = localStorage.getItem('silverHomeUser');
        if (storedUser) {
          console.log('이미 로그인되어 있습니다.');
          isRedirecting = true;
          // 현재 URL이 로그인 페이지일 때만 리디렉션
          if (window.location.pathname === '/login') {
            router.push('/dashboard');
          }
        }
      } catch (err) {
        console.error('로그인 상태 확인 오류:', err);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 간단한 유효성 검사
    if (!id || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      // 로그인 시도
      const success = login(id, password);
      
      if (success) {
        console.log('로그인 성공, 대시보드로 이동');
        router.push('/dashboard');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };
  
  // 테스트 계정 자동 입력
  const fillTestAccount = (role: string) => {
    if (role === 'admin') {
      setId('admin-1');
      setPassword('admin123');
    } else if (role === 'resident') {
      setId('resident-1');
      setPassword('resident123');
    } else if (role === 'family') {
      setId('family-1');
      setPassword('family123');
    }
  };

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
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                로그인
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
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                입주자 계정
              </button>
              <button
                onClick={() => fillTestAccount('family')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                가족 계정
              </button>
              <button
                onClick={() => fillTestAccount('admin')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50"
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
