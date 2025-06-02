'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
export const config = {
  dynamic: 'force-dynamic'
};

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import { User, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaSearch, FaUserPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaEllipsisH } from 'react-icons/fa';
import AuthWrapper from '@/components/AuthWrapper';

// 실제 입주자 관리 컨텐츠 컴포넌트
function ResidentsContent() {
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
  
  // 사용자 데이터 로드
  useEffect(() => {
    if (!data) return;
    loadUsers();
    
    // TODO: 실제 API 연동 시 제거할 더미 데이터
    if (applications.length === 0) {
      // 더미 신청 데이터
      const pendingApplications = [
        {
          id: 'app-001',
          name: '김신청',
          email: 'app1@example.com',
          password: 'password',
          role: 'resident' as 'resident',
          phone: '010-1234-5678',
          address: '서울시 강남구',
          status: 'pending' as 'pending',
          createdAt: '2025-05-20T10:30:00Z'
        },
        {
          id: 'app-002',
          name: '박대기',
          email: 'app2@example.com',
          password: 'password',
          role: 'family' as 'family',
          phone: '010-8765-4321',
          address: '서울시 송파구',
          status: 'pending' as 'pending',
          createdAt: '2025-05-22T14:15:00Z',
          relatedResident: '홍길동'
        }
      ];
      setApplications(pendingApplications);
    }
  }, [data, applications.length]);
  
  // 검색 필터링 적용
  const filteredResidents = residents?.filter(resident => {
    if (!resident) return false;
    
    const matchesSearch = resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resident.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || resident.role === filterRole;
    
    return matchesSearch && matchesRole;
  }) || [];
  
  // 신청 승인
  const approveApplication = (applicationId: string) => {
    try {
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') return;
      
      const appData = getDataFromStorage();
      const userToApprove = appData.users.find((u: User) => u.id === applicationId);
      
      if (userToApprove) {
        userToApprove.status = 'approved';
        userToApprove.approvedAt = new Date().toISOString();
        userToApprove.approvedBy = user?.id || 'unknown';
        
        saveDataToStorage(appData);
        loadUsers();
        
        alert('신청이 승인되었습니다.');
      }
    } catch (err) {
      console.error('신청 승인 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 신청 거부
  const rejectApplication = (applicationId: string) => {
    try {
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') return;
      
      const appData = getDataFromStorage();
      const userToReject = appData.users.find((u: User) => u.id === applicationId);
      
      if (userToReject) {
        userToReject.status = 'rejected';
        userToReject.rejectedAt = new Date().toISOString();
        userToReject.rejectedBy = user?.id || 'unknown';
        
        saveDataToStorage(appData);
        loadUsers();
        
        alert('신청이 거부되었습니다.');
      }
    } catch (err) {
      console.error('신청 거부 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 사용자 삭제
  const deleteUser = (userId: string) => {
    try {
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') return;
      
      const appData = getDataFromStorage();
      
      // 해당 사용자 제거
      appData.users = appData.users.filter((u: User) => u.id !== userId);
      
      // 관련 데이터 제거 (필요한 경우)
      
      saveDataToStorage(appData);
      loadUsers();
      
      alert('사용자가 삭제되었습니다.');
    } catch (err) {
      console.error('사용자 삭제 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 사용자 정보 업데이트
  const updateUserInfo = () => {
    if (!selectedUser) return;
    
    try {
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') return;
      
      const appData = getDataFromStorage();
      const userToUpdate = appData.users.find((u: User) => u.id === selectedUser.id);
      
      if (userToUpdate) {
        // 선택된 사용자 정보로 업데이트
        Object.assign(userToUpdate, selectedUser);
        
        saveDataToStorage(appData);
        loadUsers();
        setIsModalOpen(false);
        
        alert('사용자 정보가 업데이트되었습니다.');
      }
    } catch (err) {
      console.error('사용자 정보 업데이트 오류:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 사용자 데이터 로드
  const loadUsers = () => {
    try {
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') return;
      
      const appData = getDataFromStorage();
      
      // 전체 사용자
      setResidents(appData.users.filter((u: User) => 
        u.status === 'approved' && 
        (filterRole === 'all' || u.role === filterRole) &&
        (searchTerm === '' || 
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
      
      // 승인 대기 중인 신청
      setApplications(appData.users.filter((u: User) => 
        u.status === 'pending' &&
        (searchTerm === '' || 
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    } catch (err) {
      console.error('사용자 데이터 로드 오류:', err);
    }
  };
  
  // 필터 변경 시 사용자 데이터 새로 로드
  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterRole]);
  
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
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              입주자 목록
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab === 'applications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              신청 목록
              {applications.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                  {applications.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* 검색 및 필터링 */}
        {activeTab === 'residents' && (
          <div className="mb-6">
            {/* 새로운 헤더 레이아웃 - 버튼은 오른쪽에 배치 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">입주자 목록</h2>
              
              <button
                className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  alert('신규 사용자 추가 기능 준비 중입니다.');
                }}
              >
                <FaUserPlus className="mr-1.5" />
                신규 추가
              </button>
            </div>
            
            {/* 검색 및 필터 영역 */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="grow">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="이름, 이메일로 검색..."
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-2 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center shrink-0">
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mr-2">
                  역할:
                </label>
                <select
                  id="role-filter"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-3 pr-10 text-sm border-gray-300 rounded-md"
                >
                  <option value="all">전체</option>
                  <option value="resident">입주자</option>
                  <option value="family">가족</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* 입주자 목록 */}
        {activeTab === 'residents' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredResidents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredResidents.map((resident) => (
                  <li key={resident.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{resident.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="mr-4">{resident.email}</span>
                        <span>{resident.phone}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="mr-4">{resident.address}</span>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resident.role === 'resident' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {resident.role === 'resident' ? '입주자' : '가족'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(resident);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:text-indigo-900"
                        title="편집"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                            deleteUser(resident.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:text-red-900"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  {searchTerm || filterRole !== 'all'
                    ? '검색 조건에 맞는 입주자가 없습니다.'
                    : '등록된 입주자가 없습니다.'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* 신청 목록 */}
        {activeTab === 'applications' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {applications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <li key={application.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.name}
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            대기중
                          </span>
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="mr-4">{application.email}</span>
                          <span>{application.phone}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="mr-4">{application.address}</span>
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              application.role === 'resident' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {application.role === 'resident' ? '입주자' : '가족'}
                          </span>
                        </div>
                        {application.relatedResident && (
                          <div className="mt-1 text-sm text-gray-500">
                            <span>연관 입주자: {application.relatedResident}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveApplication(application.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FaCheckCircle className="mr-1" />
                          승인
                        </button>
                        <button
                          onClick={() => rejectApplication(application.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FaTimesCircle className="mr-1" />
                          거부
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">처리 대기 중인 신청이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* 사용자 정보 수정 모달 */}
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
                    사용자 정보 수정
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">
                        이름
                      </label>
                      <input
                        type="text"
                        id="user-name"
                        value={selectedUser.name || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">
                        이메일
                      </label>
                      <input
                        type="email"
                        id="user-email"
                        value={selectedUser.email || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-phone" className="block text-sm font-medium text-gray-700">
                        전화번호
                      </label>
                      <input
                        type="text"
                        id="user-phone"
                        value={selectedUser.phone || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-address" className="block text-sm font-medium text-gray-700">
                        주소
                      </label>
                      <input
                        type="text"
                        id="user-address"
                        value={selectedUser.address || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">
                        역할
                      </label>
                      <select
                        id="user-role"
                        value={selectedUser.role || 'resident'}
                        onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as 'resident' | 'family'})}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="resident">입주자</option>
                        <option value="family">가족</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={updateUserInfo}
                >
                  저장
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  취소
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

// 인증된 관리자만 접근 가능한 입주자 관리 페이지
export default function ResidentsManagement() {
  return (
    <AuthWrapper requiredRole="admin">
      <ResidentsContent />
    </AuthWrapper>
  );
}
