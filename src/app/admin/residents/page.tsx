'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기
export const config = {
  dynamic: 'force-dynamic'
};
  
// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지


;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import { User, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaSearch, FaUserPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaEllipsisH } from 'react-icons/fa';

export default function ResidentsManagement() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { data } = useAppData();
  
  const [residents, setResidents] = useState<User[]>([]);
  const [applications, setApplications] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'resident' | 'family'>('all');
  const [activeTab, setActiveTab] = useState<'residents' | 'applications'>('residents');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 관리자 권한 확인 및 리디렉션
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      try {
        if (!user) {
          router.push('/login');
          return;
        }
        
        if (!isAdmin()) {
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('관리자 페이지 접근 오류:', error);
      }
    }
  }, [user, router, isAdmin]);
  
  // 사용자 데이터 로드
  useEffect(() => {
    if (!data || !data.users) return;
    
    // 입주자 및 가족 회원 필터링
    const allResidents = data.users.filter(u => u.role === 'resident' || u.role === 'family');
    setResidents(allResidents);
    
    // 신청 데이터 필터링 (실제로는 별도 API 필요)
    // 임시 데이터로 대체
    const pendingApplications = [
      {
        id: 'app-001',
        name: '김신청',
        password: 'password',
        role: 'resident' as 'resident',
        phone: '010-1234-5678',
        address: '서울시 강남구',
        birthdate: '1945-05-15',
        applicationStatus: 'pending',
        applicationDate: '2025-05-20T09:30:00Z'
      },
      {
        id: 'app-002',
        name: '박대기',
        password: 'password',
        role: 'family' as 'family',
        phone: '010-8765-4321',
        address: '서울시 송파구',
        applicationStatus: 'pending',
        applicationDate: '2025-05-22T14:15:00Z',
        relatedResident: '홍길동'
      }
    ];
    setApplications(pendingApplications);
  }, [data]);
  
  // 검색 필터링 적용
  const filteredResidents = residents?.filter(resident => {
    if (!resident) return false;
    
    const matchesSearch = resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resident.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || resident.role === filterRole;
    
    return matchesSearch && matchesRole;
  }) || [];
  
  // 입주 신청 승인 처리
  const handleApproveApplication = (application: User) => {
    // 실제로는 API 호출 필요
    try {
      // 로컬 스토리지에서 데이터 가져오기
      const appData = getDataFromStorage();
      
      // 승인된 사용자 추가
      const approvedUser = {
        ...application,
        role: application.role || 'resident',
        password: application.password || 'password123',
        applicationDate: application.applicationDate || new Date().toISOString(),
        status: 'approved' as 'approved'
      };
      
      // family 유형이면 relatedResident 필드 확인
      if (application.role === 'family') {
        approvedUser.relatedResident = application.relatedResident || '';
        // 호환성을 위해 residentId도 동일하게 설정
        approvedUser.residentId = application.relatedResident || '';
      }
      
      appData.users.push(approvedUser);
      
      // applications 배열에서 승인된 신청 제거
      if (Array.isArray(appData.applications)) {
        appData.applications = appData.applications.filter(app => app?.id !== application?.id);
      }
      
      // 데이터 저장
      saveDataToStorage(appData);
      
      // UI 업데이트
      setApplications(prev => prev.filter(app => app?.id !== application?.id));
      setResidents(prev => [...prev, approvedUser]);
      
      alert(`${application?.name || '사용자'}님의 입주 신청이 승인되었습니다.`);
    } catch (err) {
      console.error('입주 신청 승인 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 입주 신청 거부 처리
  const handleRejectApplication = (application: User) => {
    // 실제로는 API 호출 필요
    try {
      // 로컬 스토리지에서 데이터 가져오기
      const appData = getDataFromStorage();
      
      // 신청 목록에서 해당 신청 제거 (실제로는 상태 변경)
      // UI 업데이트
      setApplications(prev => prev.filter(app => app?.id !== application?.id));
      
      // 데이터 저장
      saveDataToStorage(appData);
      
      alert(`${application?.name || '신청자'}님의 입주 신청이 거부되었습니다.`);
    } catch (err) {
      console.error('입주 신청 거부 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 권한 없으면 로딩 표시
  if (!user || !isAdmin()) {
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
            <h1 className="text-2xl font-bold text-gray-900">입주자 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 탭 선택 */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('residents')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'residents'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              입주자 목록
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'applications'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              입주 신청
              {applications.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                  {applications.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {activeTab === 'residents' ? (
          <div>
            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <div className="relative mb-4 sm:mb-0 sm:w-72">
                <input
                  type="text"
                  placeholder="이름 또는 ID 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as 'all' | 'resident' | 'family')}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">전체</option>
                  <option value="resident">입주자</option>
                  <option value="family">가족</option>
                </select>
                
                <button
                  onClick={() => router.push('/admin/residents/new')}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <FaUserPlus className="mr-2" />
                  새 입주자 등록
                </button>
              </div>
            </div>
            
            {/* 입주자 목록 테이블 */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이름
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      구분
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      연락처
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생년월일
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((resident) => (
                      <tr key={resident?.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{resident?.name || '알 수 없음'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resident?.id || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            resident?.role === 'resident'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {resident?.role === 'resident' ? '입주자' : '가족'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {resident?.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {resident?.birthdate || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              if (resident) {
                                setSelectedUser(resident);
                                setIsModalOpen(true);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaEdit className="inline mr-2" />
                            관리
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        {searchTerm 
                          ? '검색 결과가 없습니다.' 
                          : '등록된 입주자가 없습니다.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {/* 입주 신청 목록 */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              {applications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {applications.map((application) => (
                    <div key={application?.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{application?.name || '신청자'}</h3>
                          <p className="text-gray-600 mb-2">
                            {application?.role === 'resident' ? '입주자' : '가족 회원'} 신청
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">신청 일시: </span>
                              <span>{new Date(application?.applicationDate || '').toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">연락처: </span>
                              <span>{application?.phone || '-'}</span>
                            </div>
                            {application?.address && (
                              <div className="md:col-span-2">
                                <span className="text-gray-500">주소: </span>
                                <span>{application?.address}</span>
                              </div>
                            )}
                            {application?.birthdate && (
                              <div>
                                <span className="text-gray-500">생년월일: </span>
                                <span>{application?.birthdate}</span>
                              </div>
                            )}
                            {application?.relatedResident && (
                              <div>
                                <span className="text-gray-500">관련 입주자: </span>
                                <span>{application?.relatedResident}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveApplication(application)}
                            className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            <FaCheckCircle className="mr-1" />
                            승인
                          </button>
                          <button
                            onClick={() => handleRejectApplication(application)}
                            className="flex items-center px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                          >
                            <FaTimesCircle className="mr-1" />
                            거부
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  대기 중인 입주 신청이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* 사용자 상세 모달 (실제 구현 시 별도 컴포넌트로 분리) */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedUser?.name || '사용자'} 정보 관리
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      이 기능은 데모 버전에서는 제한되어 있습니다.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            실제 애플리케이션에서는 이 모달에서 사용자 정보 수정, 비밀번호 초기화, 입주자 상태 변경 등의 기능이 제공됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈 관리자 시스템. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
