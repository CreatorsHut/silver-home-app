'use client';

import { useState } from 'react';
// SSR 안전성을 위해 router 제거
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaLock, FaIdCard, FaPhone, FaHome, FaCalendarAlt } from 'react-icons/fa';
import { User, getDataFromStorage, saveDataToStorage } from '@/data/models';

export default function Register() {
  // router 제거
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    birthdate: '',
    role: 'resident' as 'admin' | 'resident' | 'family',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 기본 유효성 검사
    if (!formData.id || !formData.password || !formData.name) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    
    if (formData.password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }
    
    // 회원가입 시도
    try {
      // User 인터페이스에 맞게 newUser 객체 생성
      const newUser: User = {
        id: formData.id,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        address: formData.address || undefined,
        birthdate: formData.birthdate || undefined,
        role: formData.role as 'admin' | 'resident' | 'family',
      };
      
      // AuthContext의 register 함수 호출
      const success = register(newUser);
      
      // 회원가입 성공 시 LocalStorage에도 저장
      if (success) {
        try {
          // 기존 데이터 가져오기
          const appData = getDataFromStorage();
          
          // 새 사용자 추가
          appData.users.push(newUser);
          
          // 업데이트된 데이터 저장
          saveDataToStorage(appData);
          
          setSuccess(true);
          // 3초 후 로그인 페이지로 이동 (SSR 안전하게 수정)
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }, 3000);
        } catch (storageErr) {
          console.error('LocalStorage 저장 오류:', storageErr);
          // AuthContext에서 등록은 성공했으므로 계속 진행
          setSuccess(true);
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }, 3000);
        }
      } else {
        setError('이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h1 className="text-center text-4xl font-bold text-red-600 cursor-pointer">실버홈</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
            로그인하기
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg text-green-700">
                    회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="id" className="block text-xl font-medium text-gray-700">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="id"
                    name="id"
                    type="text"
                    value={formData.id}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="아이디 입력"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="비밀번호 입력"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xl font-medium text-gray-700">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="비밀번호 확인"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-xl font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="이름 입력"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="birthdate" className="block text-xl font-medium text-gray-700">
                  생년월일
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xl font-medium text-gray-700">
                  연락처
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="연락처 입력 (선택사항)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xl font-medium text-gray-700">
                  주소
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHome className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md text-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="주소 입력 (선택사항)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-xl font-medium text-gray-700">
                  가입 유형 <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full py-4 px-3 border border-gray-300 bg-white rounded-md shadow-sm text-lg focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="resident">입주자</option>
                  <option value="family">가족</option>
                </select>
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
                  회원가입
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
