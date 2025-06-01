import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { redirect } from "next/navigation";

// 아이콘 임포트
import { FaHandHoldingHeart, FaCalendarAlt, FaComment, FaHeartbeat, FaBell, FaDoorOpen, FaVideo, FaUserClock } from "react-icons/fa";

export default function Home() {
  // 기능 항목 데이터
  const features = [
    {
      icon: <FaDoorOpen size={32} />,
      title: '입주 신청',
      description: '실버홈 입주를 신청하세요',
      path: '/application'
    },
    {
      icon: <FaHandHoldingHeart size={32} />,
      title: '생활 도움 요청',
      description: '청소, 수리 등 도움이 필요할 때',
      path: '/help'
    },
    {
      icon: <FaVideo size={32} />,
      title: '가족 소통창구',
      description: '가족과 영상통화로 대화하세요',
      path: '/family'
    },
    {
      icon: <FaCalendarAlt size={32} />,
      title: '공동 일정',
      description: '커뮤니티 행사와 일정 확인',
      path: '/schedule'
    },
    {
      icon: <FaComment size={32} />,
      title: '커뮤니티 채팅',
      description: '다른 입주자들과 대화하세요',
      path: '/chat'
    },
    {
      icon: <FaHeartbeat size={32} />,
      title: '건강관리',
      description: '건강 상태를 기록하고 관리하세요',
      path: '/health'
    },
    {
      icon: <FaBell size={32} />,
      title: '공지사항',
      description: '중요 공지를 확인하세요',
      path: '/notices'
    },
    {
      icon: <FaUserClock size={32} />,
      title: '시설 예약',
      description: '헬스장, 커뮤니티룸 등 예약',
      path: '/facilities'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <header className="bg-gradient-to-r from-red-600 to-red-400 text-white py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">실버홈</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          고령자를 위한 통합 생활지원 플랫폼
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            href="/login" 
            className="bg-white text-red-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
          >
            로그인
          </Link>
          <Link 
            href="/register" 
            className="bg-red-700 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-800 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </header>

      {/* 메인 섹션: 앱 기능 소개 */}
      <main className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">실버홈 주요 기능</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link 
              href={feature.path} 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <div className="text-red-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-lg">{feature.description}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* 하단 섹션: 앱 설명 */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">실버홈이 특별한 이유</h2>
          <p className="text-xl leading-relaxed mb-8">
            실버홈은 고령자분들의 편안한 생활을 위해 설계된 종합 플랫폼입니다. <br/>
            생활 도움 요청, 건강 관리, 가족과의 소통까지 한 곳에서 관리하세요.
          </p>
          <div className="mt-8">
            <Link 
              href="/about" 
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold inline-block hover:bg-red-700 transition-colors"
            >
              더 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 px-4 text-center">
        <p className="text-lg">© 2025 실버홈. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}
