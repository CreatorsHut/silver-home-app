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
import { getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaCalendarAlt, FaUserClock, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import AuthWrapper from '@/components/AuthWrapper';

// 방문 예약 관리 컨텐츠 컴포넌트
function VisitContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useAppData();
  
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    // 방문 예약 데이터 로드
    loadVisitData();
    setIsLoading(false);
  }, [selectedDate]);
  
  // 방문 예약 데이터 로드 (임시 데이터)
  const loadVisitData = () => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    // 실제로는 API 호출이나 데이터 저장소에서 가져올 것
    // localStorage에서 데이터를 가져오는 경우:
    // const appData = getDataFromStorage();
    // const storedVisits = appData.visits || [];
    
    // 임시 데이터 (데모용)
    const dummyVisits = [
      {
        id: 'visit-1',
        visitorName: '김방문',
        residentName: '박거주',
        date: '2025-06-05',
        time: '14:00',
        purpose: '정기 방문',
        status: 'approved',
        contactNumber: '010-1234-5678'
      },
      {
        id: 'visit-2',
        visitorName: '이가족',
        residentName: '이거주',
        date: '2025-06-10',
        time: '11:30',
        purpose: '생일 축하',
        status: 'pending',
        contactNumber: '010-9876-5432'
      },
      {
        id: 'visit-3',
        visitorName: '최방문',
        residentName: '정거주',
        date: selectedDate, // 선택된 날짜에 맞춰 동적으로 표시
        time: '15:45',
        purpose: '건강 체크',
        status: 'rejected',
        contactNumber: '010-5555-4444'
      }
    ];
    
    // 날짜별 필터링 (실제 구현 시)
    const filteredVisits = dummyVisits.filter(visit => 
      !selectedDate || visit.date === selectedDate
    );
    
    setVisits(filteredVisits);
  };
  
  // 방문 예약 상태 변경
  const updateVisitStatus = (visitId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      // 실제 구현에서는 저장소 업데이트 또는 API 호출
      const updatedVisits = visits.map(visit => {
        if (visit.id === visitId) {
          return { ...visit, status: newStatus };
        }
        return visit;
      });
      
      setVisits(updatedVisits);
      
      // localStorage 데이터 업데이트 예시:
      // const appData = getDataFromStorage();
      // appData.visits = updatedVisits;
      // saveDataToStorage(appData);
      
      alert(`방문 예약이 ${newStatus === 'approved' ? '승인' : newStatus === 'rejected' ? '거부' : '대기 상태로 변경'}되었습니다.`);
    } catch (error) {
      console.error('방문 예약 상태 변경 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 방문 예약 삭제
  const deleteVisit = (visitId: string) => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      if (window.confirm('정말 이 방문 예약을 삭제하시겠습니까?')) {
        const updatedVisits = visits.filter(visit => visit.id !== visitId);
        setVisits(updatedVisits);
        
        // localStorage 데이터 업데이트 예시:
        // const appData = getDataFromStorage();
        // appData.visits = updatedVisits;
        // saveDataToStorage(appData);
        
        alert('방문 예약이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('방문 예약 삭제 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 방문 예약 수정 저장
  const saveVisitChanges = () => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      if (!selectedVisit) return;
      
      const updatedVisits = visits.map(visit => {
        if (visit.id === selectedVisit.id) {
          return selectedVisit;
        }
        return visit;
      });
      
      setVisits(updatedVisits);
      
      // localStorage 데이터 업데이트 예시:
      // const appData = getDataFromStorage();
      // appData.visits = updatedVisits;
      // saveDataToStorage(appData);
      
      setIsModalOpen(false);
      setSelectedVisit(null);
      setEditMode(false);
      
      alert('방문 예약 정보가 수정되었습니다.');
    } catch (error) {
      console.error('방문 예약 수정 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 새 방문 예약 추가
  const addNewVisit = () => {
    // 브라우저 환경인지 확인
    if (typeof window === 'undefined') return;
    
    try {
      if (!selectedVisit) return;
      
      // 새 ID 생성 (실제 구현에서는 서버에서 생성)
      const newVisitId = `visit-${Date.now()}`;
      const newVisit = {
        ...selectedVisit,
        id: newVisitId,
        status: 'pending'
      };
      
      setVisits([...visits, newVisit]);
      
      // localStorage 데이터 업데이트 예시:
      // const appData = getDataFromStorage();
      // appData.visits = [...(appData.visits || []), newVisit];
      // saveDataToStorage(appData);
      
      setIsModalOpen(false);
      setSelectedVisit(null);
      setEditMode(false);
      
      alert('새 방문 예약이 추가되었습니다.');
    } catch (error) {
      console.error('방문 예약 추가 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">방문 예약 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              방문 예약 목록
            </h2>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => {
                setSelectedVisit({
                  visitorName: '',
                  residentName: '',
                  date: selectedDate,
                  time: '',
                  purpose: '',
                  contactNumber: '',
                  status: 'pending'
                });
                setEditMode(false);
                setIsModalOpen(true);
              }}
            >
              <FaPlus className="mr-2" /> 새 예약 등록
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">날짜 선택:</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {visits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">방문자</th>
                    <th className="py-3 px-4 text-left">입주자</th>
                    <th className="py-3 px-4 text-left">날짜</th>
                    <th className="py-3 px-4 text-left">시간</th>
                    <th className="py-3 px-4 text-left">방문 목적</th>
                    <th className="py-3 px-4 text-left">상태</th>
                    <th className="py-3 px-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit) => (
                    <tr key={visit.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{visit.visitorName}</td>
                      <td className="py-3 px-4">{visit.residentName}</td>
                      <td className="py-3 px-4">{visit.date}</td>
                      <td className="py-3 px-4">{visit.time}</td>
                      <td className="py-3 px-4">{visit.purpose}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          visit.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : visit.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {visit.status === 'approved' ? '승인됨' : visit.status === 'pending' ? '대기 중' : '거부됨'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          {visit.status === 'pending' && (
                            <>
                              <button 
                                className="text-green-600 hover:text-green-800"
                                title="승인"
                                onClick={() => updateVisitStatus(visit.id, 'approved')}
                              >
                                <FaCheckCircle />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800"
                                title="거부"
                                onClick={() => updateVisitStatus(visit.id, 'rejected')}
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            title="수정"
                            onClick={() => {
                              setSelectedVisit({...visit});
                              setEditMode(true);
                              setIsModalOpen(true);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            title="삭제"
                            onClick={() => deleteVisit(visit.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-3" />
              <p>선택한 날짜에 예약된 방문이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* 방문 예약 수정/추가 모달 */}
      {isModalOpen && selectedVisit && (
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
                    {editMode ? '방문 예약 수정' : '새 방문 예약 등록'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="visitor-name" className="block text-sm font-medium text-gray-700">
                        방문자 이름
                      </label>
                      <input
                        type="text"
                        id="visitor-name"
                        value={selectedVisit.visitorName || ''}
                        onChange={(e) => setSelectedVisit({...selectedVisit, visitorName: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resident-name" className="block text-sm font-medium text-gray-700">
                        방문할 입주자
                      </label>
                      <input
                        type="text"
                        id="resident-name"
                        value={selectedVisit.residentName || ''}
                        onChange={(e) => setSelectedVisit({...selectedVisit, residentName: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="visit-date" className="block text-sm font-medium text-gray-700">
                          방문 날짜
                        </label>
                        <input
                          type="date"
                          id="visit-date"
                          value={selectedVisit.date || ''}
                          onChange={(e) => setSelectedVisit({...selectedVisit, date: e.target.value})}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="visit-time" className="block text-sm font-medium text-gray-700">
                          방문 시간
                        </label>
                        <input
                          type="time"
                          id="visit-time"
                          value={selectedVisit.time || ''}
                          onChange={(e) => setSelectedVisit({...selectedVisit, time: e.target.value})}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700">
                        연락처
                      </label>
                      <input
                        type="text"
                        id="contact-number"
                        value={selectedVisit.contactNumber || ''}
                        onChange={(e) => setSelectedVisit({...selectedVisit, contactNumber: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="visit-purpose" className="block text-sm font-medium text-gray-700">
                        방문 목적
                      </label>
                      <textarea
                        id="visit-purpose"
                        rows={3}
                        value={selectedVisit.purpose || ''}
                        onChange={(e) => setSelectedVisit({...selectedVisit, purpose: e.target.value})}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    {editMode && (
                      <div>
                        <label htmlFor="visit-status" className="block text-sm font-medium text-gray-700">
                          상태
                        </label>
                        <select
                          id="visit-status"
                          value={selectedVisit.status || 'pending'}
                          onChange={(e) => setSelectedVisit({...selectedVisit, status: e.target.value})}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="pending">대기 중</option>
                          <option value="approved">승인됨</option>
                          <option value="rejected">거부됨</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={editMode ? saveVisitChanges : addNewVisit}
                >
                  {editMode ? '저장' : '추가'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedVisit(null);
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

// 인증된 관리자만 접근 가능한 방문 예약 관리 페이지
export default function VisitManagementPage() {
  return (
    <AuthWrapper requiredRole="admin">
      <VisitContent />
    </AuthWrapper>
  );
}
