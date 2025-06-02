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
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Schedule } from '@/data/models';
import AuthWrapper from '@/components/AuthWrapper';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';

function ScheduleContent() {
  const { user } = useAuth();
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 카테고리 옵션
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'health', name: '건강' },
    { id: 'entertainment', name: '오락' },
    { id: 'education', name: '교육' },
    { id: 'social', name: '친목' },
    { id: 'other', name: '기타' }
  ];

  // 데이터 로딩
  useEffect(() => {
    // 로컬스토리지에서 일정 데이터 가져오기
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const { schedules: storedSchedules } = JSON.parse(storedData);
          setSchedules(storedSchedules || []);
        }
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('일정 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 일정 필터링
  useEffect(() => {
    let result = [...schedules];
    
    // 검색어로 필터링
    if (searchQuery) {
      result = result.filter(schedule => 
        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        schedule.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 카테고리로 필터링
    if (filterCategory !== 'all') {
      result = result.filter(schedule => schedule.category === filterCategory);
    }
    
    // 현재 선택된 월로 필터링 (캘린더 뷰에서만)
    if (view === 'calendar') {
      result = result.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getMonth() === selectedMonth && 
               scheduleDate.getFullYear() === selectedYear;
      });
    }
    
    // 날짜순 정렬
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setFilteredSchedules(result);
  }, [schedules, searchQuery, filterCategory, selectedMonth, selectedYear, view]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // 월 이름 배열
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월', 
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // 다음 달로 이동
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // 이전 달로 이동
  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  // 해당 월의 일수 구하기
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 해당 월의 첫째 날 요일 구하기 (0: 일요일, 6: 토요일)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 캘린더 데이터 생성
  const generateCalendarData = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    
    // 빈 날짜 배열 생성 (이전 달의 날짜로 채워짐)
    const days = Array(firstDayOfMonth).fill(null);
    
    // 이번 달 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // 특정 날짜에 해당하는 일정 찾기
  const getSchedulesForDay = (day: number | null) => {
    if (day === null) return [];
    
    return filteredSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.getDate() === day && 
             scheduleDate.getMonth() === selectedMonth && 
             scheduleDate.getFullYear() === selectedYear;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <FaArrowLeft className="mr-2" />
            <h1 className="text-2xl font-bold">공동 일정</h1>
          </Link>
          
          <div className="flex space-x-4">
            {user && (
              <span className="flex items-center">
                <FaUser className="mr-1" /> {user.name}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {/* 뷰 전환 및 검색 필터 */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-md ${
                  view === 'list' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                목록 보기
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-md ${
                  view === 'calendar' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                캘린더 보기
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="일정 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {view === 'list' ? (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">일정 목록</h2>
                
                {filteredSchedules.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery || filterCategory !== 'all' 
                      ? '검색 결과가 없습니다.' 
                      : '등록된 일정이 없습니다.'}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredSchedules.map((schedule) => (
                      <li key={schedule.id} className="py-6">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                schedule.category === 'health' ? 'bg-green-500' :
                                schedule.category === 'entertainment' ? 'bg-purple-500' :
                                schedule.category === 'education' ? 'bg-blue-500' :
                                schedule.category === 'social' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`}></span>
                              <h3 className="text-xl font-semibold text-gray-900">{schedule.title}</h3>
                            </div>
                            
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                              <div className="flex items-center mr-4">
                                <FaCalendarAlt className="mr-1" />
                                <span>{formatDate(schedule.date)}</span>
                              </div>
                              <div className="flex items-center mr-4">
                                <FaClock className="mr-1" />
                                <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                              </div>
                              <div className="flex items-center">
                                <FaMapMarkerAlt className="mr-1" />
                                <span>{schedule.location}</span>
                              </div>
                            </div>
                            
                            <p className="mt-3 text-gray-700">{schedule.description}</p>
                          </div>
                          
                          <div className="mt-4 md:mt-0 md:ml-6">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              schedule.category === 'health' ? 'bg-green-100 text-green-800' :
                              schedule.category === 'entertainment' ? 'bg-purple-100 text-purple-800' :
                              schedule.category === 'education' ? 'bg-blue-100 text-blue-800' :
                              schedule.category === 'social' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {categories.find(c => c.id === schedule.category)?.name || '기타'}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedYear}년 {monthNames[selectedMonth]}
                  </h2>
                  
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                    <div key={index} className="text-center font-semibold py-2 text-gray-700">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarData().map((day, index) => {
                    const daySchedules = getSchedulesForDay(day);
                    
                    return (
                      <div 
                        key={index} 
                        className={`border rounded-lg min-h-[120px] p-2 ${
                          day === null 
                            ? 'bg-gray-50' 
                            : 'hover:border-red-300'
                        } ${
                          day === new Date().getDate() && 
                          selectedMonth === new Date().getMonth() && 
                          selectedYear === new Date().getFullYear()
                            ? 'border-red-500 bg-red-50' 
                            : ''
                        }`}
                      >
                        {day !== null && (
                          <>
                            <div className="text-right mb-1">
                              <span className={`text-sm font-semibold ${
                                index % 7 === 0 ? 'text-red-600' : 
                                index % 7 === 6 ? 'text-blue-600' : 
                                'text-gray-700'
                              }`}>
                                {day}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              {daySchedules.map((schedule, idx) => (
                                <div 
                                  key={idx} 
                                  className={`text-xs p-1 rounded truncate ${
                                    schedule.category === 'health' ? 'bg-green-100 text-green-800' :
                                    schedule.category === 'entertainment' ? 'bg-purple-100 text-purple-800' :
                                    schedule.category === 'education' ? 'bg-blue-100 text-blue-800' :
                                    schedule.category === 'social' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                  title={`${schedule.title} (${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)})`}
                                >
                                  {schedule.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 일정 페이지
export default function SchedulePage() {
  return (
    <AuthWrapper>
      <ScheduleContent />
    </AuthWrapper>
  );
}
