'use client'

// Next.js 15.3.3 호환성을 위한 페이지 설정
// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기
export const config = {
  dynamic: 'force-dynamic'
};
  
// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지


;

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import AuthWrapper from '@/components/AuthWrapper';
import { FaHandHoldingHeart, FaCalendarAlt, FaComment, FaHeartbeat, FaBell, FaUserClock, FaVideo, FaExclamationTriangle, FaHome, FaCalendarCheck, FaExclamationCircle, FaUsers, FaCapsules, FaClipboardList, FaBroom, FaBuilding, FaPhoneAlt } from 'react-icons/fa';

// 서비스 카드 컴포넌트 정의
interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

// 서비스 카드 컴포넌트
function ServiceCard({ icon, title, description, link }: ServiceCardProps) {
  return (
    <Link
      href={link}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
    >
      <div className="text-red-500 text-3xl mb-3">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

// 대시보드 컨텐츠 컴포넌트
function DashboardContent() {
  const { user, logout, isAdmin, isResident, isFamily } = useAuth();
  const appContext = useAppData();
  const { requests, emergencyCalls, notices, schedules, messages } = appContext.data;
  
  // user가 null이 아님을 보장 (AuthWrapper가 이미 처리함)
  if (!user) return null;

  // 데이터가 undefined일 경우 빈 배열로 초기화하여 안전하게 처리
  const noticesData = notices || [];
  const schedulesData = schedules || [];
  const requestsData = requests || [];
  const emergencyCallsData = emergencyCalls || [];
  
  // 최근 공지사항 3개
  const recentNotices = [...noticesData].sort((a, b) => 
    new Date(b?.createdAt || Date.now()).getTime() - new Date(a?.createdAt || Date.now()).getTime()
  ).slice(0, 3);
  
  // 최근 일정 3개
  const upcomingSchedules = [...schedulesData]
    .filter(schedule => schedule?.date && new Date(schedule.date) >= new Date())
    .sort((a, b) => new Date(a?.date || Date.now()).getTime() - new Date(b?.date || Date.now()).getTime())
    .slice(0, 3);
  
  // 처리되지 않은 요청 수
  const pendingRequestsCount = requestsData.filter(r => r?.status === 'pending').length;
  
  // 처리되지 않은 긴급 호출 수
  const pendingEmergencyCallsCount = emergencyCallsData.filter(c => c?.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 및 네비게이션 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          {/* 모바일에서는 세로 배치, 데스크톱에서는 가로 배치 */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex justify-between items-center">
              <Link href="/dashboard">
                <h1 className="text-2xl md:text-3xl font-bold">실버홈</h1>
              </Link>
              {/* 모바일에서는 사용자 이름을 오른쪽에 표시 */}
              <span className="md:hidden text-base font-semibold">{user?.name || '사용자'}님</span>
            </div>
            
            {/* 버튼 그룹 - 모바일에서는 아래에 표시 */}
            <div className="flex items-center justify-between mt-3 md:mt-0">
              {/* 데스크톱에서만 사용자 이름 표시 */}
              <span className="hidden md:inline text-xl mr-3">{user?.name || '사용자'}님 환영합니다</span>
              
              <div className="flex gap-2 w-full md:w-auto">
                {isAdmin() && (
                  <Link href="/admin/dashboard" className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm md:text-base transition-colors font-semibold gap-1 flex-1 md:flex-initial">
                    <FaUsers className="h-4 w-4" />
                    <span>관리자</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center justify-center bg-red-700 hover:bg-red-800 px-3 py-2 rounded-md text-sm md:text-base transition-colors font-semibold gap-1 flex-1 md:flex-initial"
                >
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* 환영 메시지 및 요약 정보 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">안녕하세요, {user?.name || '사용자'}님!</h2>
          
          {/* 역할별 대시보드 요약 정보 */}
          {isResident() && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">현재 상태</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">미확인 알림</p>
                  <p className="text-3xl font-bold text-red-600">{(messages || []).filter(m => m && ('read' in m) && m.read === false).length}개</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">도움 요청</p>
                  <p className="text-3xl font-bold text-blue-600">{pendingRequestsCount}건</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">다가오는 일정</p>
                  <p className="text-3xl font-bold text-green-600">{upcomingSchedules.length}개</p>
                </div>
              </div>
            </div>
          )}
          
          {isFamily() && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">가족 대시보드</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">미확인 알림</p>
                  <p className="text-3xl font-bold text-red-600">{(messages || []).filter(m => m && ('read' in m) && m.read === false).length}개</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">다음 방문</p>
                  <p className="text-3xl font-bold text-blue-600">없음</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">다가오는 일정</p>
                  <p className="text-3xl font-bold text-green-600">{upcomingSchedules.length}개</p>
                </div>
              </div>
            </div>
          )}
          
          {isAdmin() && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">관리자 대시보드</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">현재 입주자</p>
                  <p className="text-3xl font-bold text-red-600">{appContext.data?.users?.filter(u => u?.role === 'resident')?.length || 0}명</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">대기중인 요청</p>
                  <p className="text-3xl font-bold text-blue-600">{pendingRequestsCount}건</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">현재 긴급 상황</p>
                  <p className="text-3xl font-bold text-green-600">{pendingEmergencyCallsCount}건</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 주요 서비스 바로가기 */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">주요 서비스</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon={<FaCalendarAlt />}
              title="공동 일정"
              description="커뮤니티 행사와 일정을 확인하고 참여하세요."
              link="/schedule"
            />
            
            <ServiceCard 
              icon={<FaComment />}
              title="커뮤니티 채팅"
              description="다른 입주자들과 대화하고 정보를 공유하세요."
              link="/chat"
            />
            
            <ServiceCard 
              icon={<FaBell />}
              title="공지사항"
              description="중요 공지를 확인하고 최신 소식을 확인하세요."
              link="/notices"
            />
            
            {(isResident() || isFamily()) && (
              <ServiceCard 
                icon={<FaHome />}
                title="입주 신청"
                description="실버홈 입주를 신청하고 입주 정보를 확인하세요."
                link="/application"
              />
            )}
            
            <ServiceCard 
              icon={<FaBuilding />}
              title="시설 예약"
              description="헬스장, 커뮤니티룸 등 시설을 예약하세요."
              link="/facilities"
            />
            
            {isResident() && (
              <ServiceCard 
                icon={<FaCapsules />}
                title="건강관리"
                description="혈압, 복약 기록 등 건강 정보를 기록하고 관리하세요."
                link="/health"
              />
            )}
            
            {(isResident() || isFamily()) && (
              <ServiceCard 
                icon={<FaBroom />}
                title="생활 도움 요청"
                description="청소, 수리 등 일상생활에 필요한 도움을 요청하세요."
                link="/help"
              />
            )}
            
            {isResident() && (
              <ServiceCard 
                icon={<FaPhoneAlt />}
                title="긴급 호출"
                description="긴급 상황 발생 시 빠르게 도움을 요청하세요."
                link="/emergency"
              />
            )}
            
            {/* 관리자 전용 메뉴 */}
            {isAdmin() && (
              <>
                <ServiceCard 
                  icon={<FaExclamationTriangle />}
                  title="긴급 상황 관리"
                  description="긴급 호출 및 상황을 관리합니다."
                  link="/admin/emergency"
                />
                
                <ServiceCard 
                  icon={<FaUsers />}
                  title="입주자 관리"
                  description="입주자 정보를 관리하고 신청을 처리합니다."
                  link="/admin/residents"
                />
                
                <ServiceCard 
                  icon={<FaUserClock />}
                  title="방문 예약 관리"
                  description="입주자 방문 일정을 예약하고 관리합니다."
                  link="/admin/visit"
                />
                
                <ServiceCard 
                  icon={<FaVideo />}
                  title="가족 소통 관리"
                  description="입주자와 가족 간 소통 채널을 관리합니다."
                  link="/admin/family-chat"
                />
              </>
            )}
          </div>
        </div>

        {/* 최근 공지사항 및 일정 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* 최근 공지사항 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">최근 공지사항</h3>
              <Link href="/notices" className="text-red-600 hover:text-red-800">
                더보기 &rarr;
              </Link>
            </div>
            {recentNotices.length > 0 ? (
              <ul className="space-y-4">
                {recentNotices.map((notice) => (
                  <li key={notice?.id || 'notice-' + Math.random()} className="border-b pb-3">
                    <Link href={`/notices/${notice?.id || '#'}`} className="block hover:bg-gray-50 -m-3 p-3 rounded">
                      <h4 className="text-xl font-semibold">{notice?.title || '제목 없음'}</h4>
                      <p className="text-gray-500 mt-1">
                        {notice?.createdAt ? new Date(notice.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">공지사항이 없습니다.</p>
            )}
          </div>

          {/* 다가오는 일정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">다가오는 일정</h3>
              <Link href="/schedule" className="text-red-600 hover:text-red-800">
                더보기 &rarr;
              </Link>
            </div>
            {upcomingSchedules.length > 0 ? (
              <ul className="space-y-4">
                {upcomingSchedules.map((schedule) => (
                  <li key={schedule?.id || 'schedule-' + Math.random()} className="border-b pb-3">
                    <Link href={`/schedule/${schedule?.id || '#'}`} className="block hover:bg-gray-50 -m-3 p-3 rounded">
                      <h4 className="text-xl font-semibold">{schedule?.title || '일정 제목'}</h4>
                      <p className="text-gray-500 mt-1">
                        {schedule?.date ? new Date(schedule.date).toLocaleDateString() : ''} 
                        {schedule?.time || (schedule?.startTime && schedule?.endTime) ? 
                          (schedule?.time || `${schedule?.startTime}-${schedule?.endTime}`) : ''}
                      </p>
                      <p className="text-gray-600 mt-1">{schedule?.location || ''}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">예정된 일정이 없습니다.</p>
            )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 대시보드 컴포넌트 내보내기 - AuthWrapper로 감싸서 인증 처리
export default function Dashboard() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  );
}
