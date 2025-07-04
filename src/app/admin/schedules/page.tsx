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
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaArrowLeft, FaPlus, FaCalendarAlt } from 'react-icons/fa';

// 일정 관리 컨텐츠 컴포넌트
function SchedulesContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  // 페이지 로드 완료 로깅
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Schedules 페이지 로드 완료');
    }
  }, []);
  
  // AuthWrapper가 인증과 권한 처리를 담당하므로 권한 확인 코드 불필요
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">일정 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">월간 일정</h2>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center">
              <FaPlus className="mr-2" />
              새 일정 추가
            </button>
          </div>
          
          <div className="border rounded-lg p-4 mb-6">
            {/* 캘린더 컴포넌트 (기본 구조) */}
            <div className="flex justify-between items-center mb-4">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                &lt; 이전 달
              </button>
              <h3 className="text-lg font-medium">2025년 6월</h3>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                다음 달 &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2">
              <div className="p-2 text-red-600">일</div>
              <div className="p-2">월</div>
              <div className="p-2">화</div>
              <div className="p-2">수</div>
              <div className="p-2">목</div>
              <div className="p-2">금</div>
              <div className="p-2 text-blue-600">토</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* 샘플 날짜들 */}
              {Array.from({ length: 30 }).map((_, index) => (
                <div key={index} className="border p-2 min-h-[80px] hover:bg-gray-50">
                  <span className="text-sm">{index + 1}</span>
                  {/* 여기에 일정이 표시됨 */}
                  {index === 14 && (
                    <div className="mt-1 p-1 bg-blue-100 text-blue-800 text-xs rounded">건강 검진</div>
                  )}
                  {index === 19 && (
                    <div className="mt-1 p-1 bg-green-100 text-green-800 text-xs rounded">음악 공연</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">선택된 날짜: 2025년 6월 15일</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-red-600 mr-2" />
                  <span className="font-medium">건강 검진</span>
                </div>
                <div className="space-x-2">
                  <button className="text-blue-600 px-2 py-1 text-sm">편집</button>
                  <button className="text-red-600 px-2 py-1 text-sm">삭제</button>
                </div>
              </div>
              <p className="text-gray-600 mt-2 text-sm">전체 입주자 대상 정기 건강 검진</p>
              <div className="mt-2 text-sm text-gray-500">
                <div>시간: 오전 9:00 - 오후 5:00</div>
                <div>장소: 실버홈 의료실</div>
              </div>
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

// AuthWrapper로 감싸서 admin 권한 확인
export default function SchedulesManagement() {
  return (
    <AuthWrapper requiredRole="admin">
      <SchedulesContent />
    </AuthWrapper>
  );
}

// config는 파일 상단에 이미 선언됨
