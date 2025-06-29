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
import { Facility } from '@/data/models';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AuthWrapper from '@/components/AuthWrapper';

// 시설 관리 컨텐츠 컴포넌트
function FacilitiesContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 페이지 로드 완료 로깅
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Facilities 페이지 로드 완료');
      
      try {
        // 시설 데이터 로드
        loadFacilities();
      } catch (error) {
        console.error('시설 데이터 로드 오류:', error);
      }
    }
  }, []);
  
  // 시설 데이터 로드
  const loadFacilities = () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const { facilities } = JSON.parse(storedData);
          setFacilities(facilities || []);
        }
      }
    } catch (error) {
      console.error('시설 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 화면
  if (loading) {
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
            <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">시설 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">시설 목록</h2>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center">
            <FaPlus className="mr-2" />
            새 시설 등록
          </button>
        </div>
        
        {/* 시설 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.length > 0 ? (
            facilities.map((facility) => (
              <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {facility?.imageUrl ? (
                    <img 
                      src={facility.imageUrl} 
                      alt={facility?.name || '시설 이미지'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{facility?.name || '이름 없음'}</h3>
                  <p className="text-gray-600 text-sm mb-2">{facility?.location || '위치 정보 없음'}</p>
                  <p className="text-gray-600 text-sm mb-4">수용 인원: {facility?.capacity || 0}명</p>
                  <div className="flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800">상세 보기</button>
                    <div className="space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">등록된 시설이 없습니다.</p>
              <p className="text-sm text-gray-500 mt-1">새 시설을 추가해주세요.</p>
            </div>
          )}
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

// AuthWrapper로 감싸서 admin 권한 확인
export default function FacilitiesManagement() {
  return (
    <AuthWrapper requiredRole="admin">
      <FacilitiesContent />
    </AuthWrapper>
  );
}
