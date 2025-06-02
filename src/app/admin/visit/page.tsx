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
import { getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaCalendarAlt, FaUserClock, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function VisitManagementPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { data } = useAppData();
  
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
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
        
        // 방문 예약 데이터 로드 (예시)
        loadVisitData();
      } catch (error) {
        console.error('방문 예약 관리 페이지 접근 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, router, isAdmin]);
  
  // 방문 예약 데이터 로드 (임시 데이터)
  const loadVisitData = () => {
    // 실제로는 API 호출이나 데이터 저장소에서 가져올 것
    const dummyVisits = [
      {
        id: 'visit-1',
        visitorName: '김방문',
        residentName: '박거주',
        date: '2025-06-05',
        time: '14:00',
        purpose: '정기 방문',
        status: 'approved'
      },
      {
        id: 'visit-2',
        visitorName: '이가족',
        residentName: '이거주',
        date: '2025-06-10',
        time: '11:30',
        purpose: '생일 축하',
        status: 'pending'
      }
    ];
    
    setVisits(dummyVisits);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="mr-4 text-red-600 hover:text-red-800">
          <FaArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">방문 예약 관리</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">방문 예약 목록</h2>
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => alert('새 방문 예약 추가 기능은 개발 중입니다.')}
          >
            <FaPlus className="mr-2" /> 새 예약 등록
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">날짜 선택:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-md px-4 py-2"
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
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => alert('수정 기능은 개발 중입니다.')}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => alert('삭제 기능은 개발 중입니다.')}
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
          <div className="text-center py-8 text-gray-500">
            선택한 날짜에 예약된 방문이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
