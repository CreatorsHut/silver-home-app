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
import AuthWrapper from '@/components/AuthWrapper';
import { Facility, Reservation, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaUser, FaBuilding, FaCalendarAlt, FaClock, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

// 시설 예약 콘텐츠 컴포넌트
function FacilitiesContent() {
  const { user } = useAuth();
  
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState<'facilities' | 'my-reservations'>('facilities');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // 예약 폼 상태
  const [reservationForm, setReservationForm] = useState({
    date: typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '',
    startTime: '09:00',
    endTime: '10:00',
    purpose: ''
  });
  
  // 시간 선택 옵션
  const timeSlots = typeof window !== 'undefined' ? Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8; // 8 AM to 8 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  }) : [];

  // 데이터 로딩
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      
      // 로컬스토리지에서 시설 및 예약 데이터 가져오기
      try {
        const parsedData = getDataFromStorage();
        setFacilities(parsedData.facilities || []);
        setReservations(parsedData.reservations || []);
        
        // 예약 데이터가 없으면 샘플 데이터 추가
        if (!parsedData.reservations || parsedData.reservations.length === 0) {
          const mockReservations: Reservation[] = [
            {
              id: 'res-1',
              facilityId: 'facility-1',
              userId: 'user-1',
              userName: '김철수',
              date: '2025-05-31',
              startTime: '10:00',
              endTime: '12:00',
              purpose: '가족 모임',
              status: 'approved',
              createdAt: '2025-05-28T14:30:00'
            },
            {
              id: 'res-2',
              facilityId: 'facility-2',
              userId: 'user-2',
              userName: '이영희',
              date: '2025-06-01',
              startTime: '14:00',
              endTime: '16:00',
              purpose: '독서 모임',
              status: 'pending',
              createdAt: '2025-05-29T09:15:00'
            },
            {
              id: 'res-3',
              facilityId: 'facility-3',
              userId: user?.id || 'unknown',
              userName: user?.name || '사용자',
              date: '2025-06-02',
              startTime: '13:00',
              endTime: '15:00',
              purpose: '친목 모임',
              status: 'approved',
              createdAt: '2025-05-30T11:45:00'
            }
          ];
          
          const updatedData = {...parsedData, reservations: mockReservations};
          saveDataToStorage(updatedData);
          setReservations(mockReservations);
        }
      } catch (err) {
        console.error('데이터 로드 오류:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  // 예약 생성 처리
  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 브라우저 환경 체크
    if (typeof window === 'undefined') return;
    
    if (!selectedFacility) return;
    
    if (!reservationForm.date || !reservationForm.startTime || !reservationForm.endTime || !reservationForm.purpose) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    // 시간 유효성 검사
    if (reservationForm.startTime >= reservationForm.endTime) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }
    
    // 예약 중복 체크
    let hasOverlappingReservation = false;
    
    // 1. 기존 예약에서 중복 확인
    hasOverlappingReservation = reservations.some(res => 
      res.facilityId === selectedFacility.id && 
      res.date === reservationForm.date &&
      res.status !== 'cancelled' &&
      res.status !== 'rejected' &&
      ((reservationForm.startTime >= res.startTime && reservationForm.startTime < res.endTime) ||
      (reservationForm.endTime > res.startTime && reservationForm.endTime <= res.endTime) ||
      (reservationForm.startTime <= res.startTime && reservationForm.endTime >= res.endTime))
    );
    
    // 2. 시설 bookings에서 추가 확인 (slots 형태와의 호환성 유지)
    if (!hasOverlappingReservation && selectedFacility.bookings && Array.isArray(selectedFacility.bookings)) {
      const hasBookingConflict = selectedFacility.bookings.some(booking => 
        booking.date === reservationForm.date &&
        booking.slot === `${reservationForm.startTime}-${reservationForm.endTime}`
      );
      
      if (hasBookingConflict) {
        hasOverlappingReservation = true;
      }
    }
    
    if (hasOverlappingReservation) {
      setError('선택한 시간에 이미 예약이 있습니다.');
      return;
    }
    
    // 새 예약 생성
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      facilityId: selectedFacility.id,
      userId: user?.id || 'unknown',
      userName: user?.name || '사용자',
      date: reservationForm.date,
      startTime: reservationForm.startTime,
      endTime: reservationForm.endTime,
      purpose: reservationForm.purpose,
      status: 'pending' as const,
      createdAt: typeof window !== 'undefined' ? new Date().toISOString() : ''
    };
    
    setReservations(prev => [...prev, newReservation]);
    
    // localStorage에 예약 데이터 저장
    try {
      if (typeof window !== 'undefined') {
        const parsedData = getDataFromStorage();
        if (!parsedData.reservations) {
          parsedData.reservations = [];
        }
        parsedData.reservations.push(newReservation);
        saveDataToStorage(parsedData);
      }
    } catch (err) {
      console.error('예약 데이터 저장 오류:', err);
    }
    
    // 폼 초기화
    setReservationForm({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      purpose: ''
    });
    
    setSelectedFacility(null);
    setActiveTab('my-reservations');
    setSuccessMessage('예약이 신청되었습니다. 관리자 승인 후 확정됩니다.');
    setError('');
    
    // 3초 후 성공 메시지 제거
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // 예약 취소 처리
  const handleCancelReservation = (reservationId: string) => {
    // 브라우저 환경 체크
    if (typeof window === 'undefined') return;
    
    if (!window.confirm('예약을 취소하시겠습니까?')) return;
    
    try {
      // 예약 취소 처리 (상태 변경)
      const updatedReservations = reservations.map(res => 
        res.id === reservationId ? { ...res, status: 'cancelled' as const } : res
      );
      
      // 로컬스토리지 업데이트
      const parsedData = getDataFromStorage();
      const updatedData = {
        ...parsedData,
        reservations: updatedReservations
      };
      saveDataToStorage(updatedData);
      
      // 상태 업데이트
      setReservations(updatedReservations);
      setSuccessMessage('예약이 취소되었습니다.');
      
      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('예약 취소 오류:', err);
      setError('예약 취소 중 오류가 발생했습니다.');
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  // 예약 상태 표시 색상
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 예약 상태 한글 변환
  const getStatusName = (status: string) => {
    switch(status) {
      case 'approved': return '승인됨';
      case 'pending': return '대기 중';
      case 'rejected': return '거부됨';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <a 
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== 'undefined') {
                window.location.href = '/dashboard';
              }
            }}
            className="flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            <h1 className="text-3xl font-bold">실버홈</h1>
          </a>
          <h2 className="text-2xl font-bold">시설 예약</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* 성공/에러 메시지 */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`${
                activeTab === 'facilities'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl`}
            >
              <FaBuilding className="inline-block mr-2" />
              시설 목록
            </button>
            <button
              onClick={() => setActiveTab('my-reservations')}
              className={`${
                activeTab === 'my-reservations'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl`}
            >
              <FaCalendarAlt className="inline-block mr-2" />
              내 예약 현황
            </button>
          </nav>
        </div>

        {/* 시설 목록 */}
        {activeTab === 'facilities' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">예약 가능한 시설</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map(facility => (
                <div 
                  key={facility.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${selectedFacility?.id === facility.id ? 'ring-2 ring-red-500' : ''}`}
                >
                  <div className="relative h-48 bg-gray-300">
                    {facility.imageUrl ? (
                      <img 
                        src={facility.imageUrl} 
                        alt={facility.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <FaBuilding className="text-5xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-xl font-semibold mb-2">{facility.name}</h4>
                    <p className="text-gray-600 mb-3">{facility.type}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      <FaUser className="inline mr-1" /> 최대 {facility.capacity || '미정'} 명
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      <FaClock className="inline mr-1" /> 
                      {facility.availableFrom || '09:00'} - {facility.availableTo || '18:00'}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">{facility.description || '설명 없음'}</p>
                    
                    <button
                      onClick={() => setSelectedFacility(facility)}
                      className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 예약 폼 */}
            {selectedFacility && (
              <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {selectedFacility.name} 예약하기
                  </h3>
                  <button 
                    onClick={() => setSelectedFacility(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <form onSubmit={handleReservation}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      예약 날짜
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={reservationForm.date}
                      onChange={(e) => setReservationForm(prev => ({...prev, date: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        시작 시간
                      </label>
                      <select
                        name="startTime"
                        value={reservationForm.startTime}
                        onChange={(e) => setReservationForm(prev => ({...prev, startTime: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        {timeSlots.slice(0, -1).map(time => (
                          <option key={`start-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        종료 시간
                      </label>
                      <select
                        name="endTime"
                        value={reservationForm.endTime}
                        onChange={(e) => setReservationForm(prev => ({...prev, endTime: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        {timeSlots.slice(1).map(time => (
                          <option key={`end-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      예약 목적
                    </label>
                    <textarea
                      name="purpose"
                      value={reservationForm.purpose}
                      onChange={(e) => setReservationForm(prev => ({...prev, purpose: e.target.value}))}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="예약 목적을 입력해주세요"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    예약 신청하기
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 내 예약 현황 */}
        {activeTab === 'my-reservations' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">내 예약 현황</h3>
            
            {user && reservations.filter(res => res.userId === user.id).length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
                <p className="text-xl text-gray-600">
                  아직 예약한 시설이 없습니다.
                </p>
                <button
                  onClick={() => setActiveTab('facilities')}
                  className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  시설 예약하기
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          시설
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          날짜
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          시간
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          목적
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user && reservations
                        .filter(res => res.userId === user.id)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map(reservation => {
                          const facility = facilities.find(f => f.id === reservation.facilityId);
                          return (
                            <tr key={reservation.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {facility ? facility.name : '정보 없음'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {facility ? facility.type : ''}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {formatDate(reservation.date)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {reservation.startTime} - {reservation.endTime}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {reservation.purpose}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(reservation.status)}`}>
                                  {getStatusName(reservation.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {reservation.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    취소하기
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 시설 예약 페이지
export default function FacilitiesPage() {
  return (
    <AuthWrapper>
      <FacilitiesContent />
    </AuthWrapper>
  );
}
