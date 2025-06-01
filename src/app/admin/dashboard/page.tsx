'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import AuthWrapper from '@/components/AuthWrapper';
import { FaUsers, FaClipboardList, FaBell, FaCalendarAlt, FaCog, FaBuilding, FaChartLine, FaHome, FaComment, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';

// 관리자 서비스 카드 컴포넌트
function AdminServiceCard({ icon, title, description, link }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  link: string 
}) {
  return (
    <Link
      href={link}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-600"
    >
      <div className="flex items-start">
        <div className="text-red-600 text-3xl mr-4 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

// 관리자 대시보드 컨텐츠 컴포넌트
function AdminDashboardContent() {
  const { user, logout, isAdmin } = useAuth();
  const { data } = useAppData();
  
  // user가 null이 아님을 보장 (AuthWrapper가 이미 처리함)
  if (!user) return null;
  
  // 통계 정보 계산
  const totalResidents = data?.users?.filter(u => u?.role === 'resident')?.length || 0;
  const pendingRequests = data?.requests?.filter(r => r?.status === 'pending')?.length || 0;
  const activeEmergencies = data?.emergencyCalls?.filter(e => e && (e.status === 'pending' || e.status === 'processing'))?.length || 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* 모바일 화면에서는 세로로 정렬, 큰 화면에서는 가로 정렬 */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <span className="md:hidden text-red-600 font-semibold">{user?.name || '관리자'}님</span>
            </div>
            
            {/* 모바일에서는 버튼들이 아래에 표시됨 */}
            <div className="flex items-center justify-between mt-4 md:mt-0">
              <span className="hidden md:inline mr-4 text-gray-600">{user?.name || '관리자'}님</span>
              <div className="flex gap-2">
                <Link href="/dashboard" className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-2 text-sm md:text-base rounded-md text-white font-semibold gap-1">
                  <FaHome className="h-4 w-4" />
                  <span>일반 페이지</span>
                </Link>
                <button 
                  onClick={logout}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 text-sm md:text-base rounded-md text-gray-700"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
            <div className="flex items-center">
              <FaUsers className="text-red-600 text-3xl mr-4" />
              <div>
                <p className="text-gray-600 text-sm">현재 입주자</p>
                <p className="text-3xl font-bold">{totalResidents}명</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center">
              <FaClipboardList className="text-yellow-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600 text-sm">대기중인 요청</p>
                <p className="text-3xl font-bold">{pendingRequests}건</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-2 text-red-700">
              <FaClipboardList className="h-5 w-5" />
              <span className="text-lg font-semibold">긴급 상황 관리</span>
            </div>
            <p className="text-gray-600 text-sm">현재 긴급 상황</p>
            <p className="text-3xl font-bold">{activeEmergencies}건</p>
          </div>
        </div>
        
        {/* 주요 서비스 */}
        <h2 className="text-2xl font-bold mb-6">주요 서비스</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <AdminServiceCard 
            icon={<FaCalendarAlt />}
            title="공동 일정"
            description="커뮤니티 행사와 일정을 확인하고 참여하세요."
            link="/schedule"
          />
          
          <AdminServiceCard 
            icon={<FaComment />}
            title="커뮤니티 채팅"
            description="다른 입주자들과 대화하고 정보를 공유하세요."
            link="/chat"
          />
          
          <AdminServiceCard 
            icon={<FaBell />}
            title="공지사항"
            description="중요 공지를 확인하고 최신 소식을 확인하세요."
            link="/notices"
          />
          
          <AdminServiceCard 
            icon={<FaHome />}
            title="입주 신청"
            description="실버홈 입주를 신청하고 입주 정보를 확인하세요."
            link="/application"
          />
          
          <AdminServiceCard 
            icon={<FaBuilding />}
            title="시설 예약"
            description="헬스장, 커뮤니티룸 등 시설을 예약하세요."
            link="/facilities"
          />
          
          <AdminServiceCard 
            icon={<FaExclamationTriangle />}
            title="긴급 상황 관리"
            description="긴급 호출 및 상황을 관리합니다."
            link="/admin/emergency"
          />
          
          <AdminServiceCard 
            icon={<FaUsers />}
            title="입주자 관리"
            description="입주자 정보를 관리하고 신청을 처리합니다."
            link="/admin/residents"
          />
        </div>
        
        {/* 관리자 기능 */}
        <h2 className="text-2xl font-bold mb-6">관리자 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <AdminServiceCard 
            icon={<FaUsers />}
            title="입주자 관리"
            description="입주자 정보 조회, 수정 및 입주 신청 승인/거부"
            link="/admin/residents"
          />
          
          <AdminServiceCard 
            icon={<FaExclamationCircle />}
            title="긴급 상황 관리"
            description="긴급 호출 응대 및 상황 기록 관리"
            link="/admin/emergency"
          />
          
          <AdminServiceCard 
            icon={<FaBell />}
            title="공지사항 관리"
            description="공지사항 작성, 수정 및 삭제"
            link="/admin/notices"
          />
          
          <AdminServiceCard 
            icon={<FaCalendarAlt />}
            title="일정 관리"
            description="실버홈 행사 및 일정 등록, 수정, 삭제"
            link="/admin/schedules"
          />
        </div>
        
        {/* 시스템 관리 */}
        <h2 className="text-2xl font-bold mb-6">시스템 관리</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminServiceCard 
            icon={<FaBuilding />}
            title="시설 관리"
            description="시설 정보 관리 및 예약 현황 확인"
            link="/admin/facilities"
          />
          <AdminServiceCard
            icon={<FaCog className="h-5 w-5" />}
            title="시스템 설정"
            description="관리자 계정 및 시스템 설정 관리"
            link="/admin/settings"
          />
        </div>
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p> 2025 실버홈 관리자 시스템. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// AdminDashboard 내보내기 - AuthWrapper로 감싸서 인증 처리
export default function AdminDashboard() {
  return (
    <AuthWrapper requiredRole="admin">
      <AdminDashboardContent />
    </AuthWrapper>
  );
}
