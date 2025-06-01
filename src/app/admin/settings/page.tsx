'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaArrowLeft, FaSave, FaCog, FaUser, FaBell, FaDatabase } from 'react-icons/fa';

export default function AdminSettings() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'notifications' | 'data'>('general');
  const [loading, setLoading] = useState(true);
  
  // 권한 확인 및 리디렉션
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    
    setLoading(false);
  }, [user, router, isAdmin]);
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: 'general' | 'users' | 'notifications' | 'data') => {
    setActiveTab(tab);
  };
  
  // 로딩 화면
  if (loading || !user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* 탭 네비게이션 */}
            <div className="md:w-64 bg-gray-50 border-r">
              <nav className="p-4">
                <ul>
                  <li>
                    <button 
                      className={`w-full text-left py-3 px-4 rounded-md flex items-center ${
                        activeTab === 'general' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('general')}
                    >
                      <FaCog className="mr-3" />
                      일반 설정
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full text-left py-3 px-4 rounded-md flex items-center ${
                        activeTab === 'users' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('users')}
                    >
                      <FaUser className="mr-3" />
                      사용자 관리
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full text-left py-3 px-4 rounded-md flex items-center ${
                        activeTab === 'notifications' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('notifications')}
                    >
                      <FaBell className="mr-3" />
                      알림 설정
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full text-left py-3 px-4 rounded-md flex items-center ${
                        activeTab === 'data' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('data')}
                    >
                      <FaDatabase className="mr-3" />
                      데이터 관리
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* 설정 내용 */}
            <div className="p-6 flex-1">
              {/* 일반 설정 */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">일반 설정</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                        사이트 이름
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        defaultValue="실버홈"
                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        사이트 설명
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        defaultValue="실버홈은 편안하고 안전한 노인 주거 공간을 제공합니다."
                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenance"
                        name="maintenance"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-700">
                        유지보수 모드 활성화
                      </label>
                    </div>
                    <button 
                      type="button" 
                      className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <FaSave className="mr-2" />
                      설정 저장
                    </button>
                  </form>
                </div>
              )}
              
              {/* 사용자 관리 */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">사용자 관리</h2>
                  <p className="text-gray-500 mb-4">
                    사용자 권한 및 계정 관리를 위한 설정입니다.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            이름
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            역할
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">관리자</td>
                          <td className="px-6 py-4 whitespace-nowrap">admin</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              관리자
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              활성화
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-800 mr-2">수정</button>
                            <button className="text-red-600 hover:text-red-800">비활성화</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">홍길동</td>
                          <td className="px-6 py-4 whitespace-nowrap">resident1</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              입주자
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              활성화
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-800 mr-2">수정</button>
                            <button className="text-red-600 hover:text-red-800">비활성화</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* 알림 설정 */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">알림 설정</h2>
                  <p className="text-gray-500 mb-4">
                    시스템 알림 및 이메일 전송 설정을 관리합니다.
                  </p>
                  <form className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">이메일 알림</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notifyNewUser"
                            name="notifyNewUser"
                            defaultChecked
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="notifyNewUser" className="ml-2 block text-sm text-gray-700">
                            신규 가입자 알림
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notifyEmergency"
                            name="notifyEmergency"
                            defaultChecked
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="notifyEmergency" className="ml-2 block text-sm text-gray-700">
                            긴급 상황 알림
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notifyApplication"
                            name="notifyApplication"
                            defaultChecked
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="notifyApplication" className="ml-2 block text-sm text-gray-700">
                            입주 신청 알림
                          </label>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <FaSave className="mr-2" />
                      설정 저장
                    </button>
                  </form>
                </div>
              )}
              
              {/* 데이터 관리 */}
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">데이터 관리</h2>
                  <p className="text-gray-500 mb-4">
                    시스템 데이터 백업 및 복원 설정을 관리합니다.
                  </p>
                  <div className="space-y-6">
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">데이터 백업</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        현재 시스템의 모든 데이터를 백업합니다.
                      </p>
                      <button 
                        type="button" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        백업 생성
                      </button>
                    </div>
                    <div className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">데이터 복원</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        기존 백업에서 데이터를 복원합니다.
                      </p>
                      <div className="flex items-center">
                        <input
                          type="file"
                          id="restoreFile"
                          className="sr-only"
                        />
                        <label
                          htmlFor="restoreFile"
                          className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                          파일 선택
                        </label>
                        <span className="ml-2 text-sm text-gray-500">파일이 선택되지 않음</span>
                      </div>
                    </div>
                    <div className="border p-4 rounded-md bg-red-50">
                      <h3 className="text-lg font-medium mb-2 text-red-800">시스템 초기화</h3>
                      <p className="text-sm text-red-600 mb-4">
                        주의: 모든 데이터가 삭제되며 이 작업은 취소할 수 없습니다.
                      </p>
                      <button 
                        type="button" 
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        시스템 초기화
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈 관리자 시스템. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
