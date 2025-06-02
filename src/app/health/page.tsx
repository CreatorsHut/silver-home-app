'use client'
  
// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
;

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import { FaArrowLeft, FaUser, FaHeartbeat, FaPills, FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';

interface BloodPressure {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  note?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  note?: string;
}

function HealthContent() {
  const { user } = useAuth();
  
  const [bloodPressures, setBloodPressures] = useState<BloodPressure[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [activeTab, setActiveTab] = useState<'bp' | 'med'>('bp');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 혈압 입력 폼 상태
  const [bpForm, setBpForm] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  // 약물 입력 폼 상태
  const [medForm, setMedForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    note: ''
  });

  // 데이터 로딩
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      // 로컬스토리지에서 건강 데이터 가져오기
      try {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const { users } = JSON.parse(storedData);
          
          // 현재 사용자 정보 가져오기
          const currentUser = users.find((u: any) => u.id === user?.id);
          
          if (currentUser && currentUser.healthData) {
            setBloodPressures(currentUser.healthData.bloodPressure || []);
            setMedications(currentUser.healthData.medications || []);
          } else {
            // 샘플 데이터
            setBloodPressures([
              {
                id: 'bp-1',
                systolic: 120,
                diastolic: 80,
                pulse: 72,
                date: '2025-05-25',
                note: '아침 식전'
              },
              {
                id: 'bp-2',
                systolic: 130,
                diastolic: 85,
                pulse: 75,
                date: '2025-05-27',
                note: '저녁 식후'
              },
              {
                id: 'bp-3',
                systolic: 125,
                diastolic: 82,
                pulse: 70,
                date: '2025-05-29',
                note: '오후 운동 후'
              }
            ]);
            
            setMedications([
              {
                id: 'med-1',
                name: '고혈압약',
                dosage: '10mg',
                frequency: '하루 1회, 아침 식후',
                startDate: '2025-01-15',
                note: '식사 후 30분 이내에 복용'
              },
              {
                id: 'med-2',
                name: '관절염약',
                dosage: '5mg',
                frequency: '하루 2회, 아침/저녁 식후',
                startDate: '2025-03-10',
                endDate: '2025-06-10',
                note: '통증이 심할 때만 복용'
              }
            ]);
          }
        }
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError('건강 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  // 혈압 기록 저장
  const handleAddBloodPressure = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bpForm.systolic || !bpForm.diastolic || !bpForm.pulse || !bpForm.date) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    const newRecord: BloodPressure = {
      id: `bp-${Date.now()}`,
      systolic: Number(bpForm.systolic),
      diastolic: Number(bpForm.diastolic),
      pulse: Number(bpForm.pulse),
      date: bpForm.date,
      note: bpForm.note || undefined
    };
    
    setBloodPressures(prev => [newRecord, ...prev].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    
    // 데이터를 localStorage에 저장
    if (typeof window !== 'undefined' && user) {
      try {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const users = parsedData.users || [];
          
          // 현재 사용자 찾기
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex >= 0) {
            // 사용자의 healthData 업데이트
            if (!users[userIndex].healthData) {
              users[userIndex].healthData = {};
            }
            if (!users[userIndex].healthData.bloodPressure) {
              users[userIndex].healthData.bloodPressure = [];
            }
            
            users[userIndex].healthData.bloodPressure = [
              newRecord,
              ...users[userIndex].healthData.bloodPressure
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            // 업데이트된 데이터 저장
            parsedData.users = users;
            localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
          }
        }
      } catch (err) {
        console.error('혈압 데이터 저장 오류:', err);
      }
    }
    
    // 폼 초기화
    setBpForm({
      systolic: '',
      diastolic: '',
      pulse: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    
    setError('');
  };

  // 약물 기록 저장
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medForm.name || !medForm.dosage || !medForm.frequency || !medForm.startDate) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: medForm.name,
      dosage: medForm.dosage,
      frequency: medForm.frequency,
      startDate: medForm.startDate,
      endDate: medForm.endDate || undefined,
      note: medForm.note || undefined
    };
    
    setMedications(prev => [newMed, ...prev].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    ));
    
    // 데이터를 localStorage에 저장
    if (typeof window !== 'undefined' && user) {
      try {
        const storedData = localStorage.getItem('silverHomeData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const users = parsedData.users || [];
          
          // 현재 사용자 찾기
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex >= 0) {
            // 사용자의 healthData 업데이트
            if (!users[userIndex].healthData) {
              users[userIndex].healthData = {};
            }
            if (!users[userIndex].healthData.medications) {
              users[userIndex].healthData.medications = [];
            }
            
            users[userIndex].healthData.medications = [
              newMed,
              ...users[userIndex].healthData.medications
            ].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
            
            // 업데이트된 데이터 저장
            parsedData.users = users;
            localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
          }
        }
      } catch (err) {
        console.error('약물 데이터 저장 오류:', err);
      }
    }
    
    // 폼 초기화
    setMedForm({
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      note: ''
    });
    
    setError('');
  };

  // 혈압 기록 삭제
  const handleDeleteBP = (id: string) => {
    // UI 상태 업데이트
    setBloodPressures(prev => {
      const updated = prev.filter(bp => bp.id !== id);
      
      // localStorage에 변경 내용 저장
      if (typeof window !== 'undefined' && user) {
        try {
          const storedData = localStorage.getItem('silverHomeData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            const users = parsedData.users || [];
            
            // 현재 사용자 찾기
            const userIndex = users.findIndex((u: any) => u.id === user.id);
            
            if (userIndex >= 0 && users[userIndex].healthData) {
              // 혈압 데이터 업데이트
              users[userIndex].healthData.bloodPressure = updated;
              
              // 업데이트된 데이터 저장
              parsedData.users = users;
              localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
            }
          }
        } catch (err) {
          console.error('혈압 데이터 삭제 오류:', err);
        }
      }
      
      return updated;
    });
  };

  // 약물 기록 삭제
  const handleDeleteMed = (id: string) => {
    // UI 상태 업데이트
    setMedications(prev => {
      const updated = prev.filter(med => med.id !== id);
      
      // localStorage에 변경 내용 저장
      if (typeof window !== 'undefined' && user) {
        try {
          const storedData = localStorage.getItem('silverHomeData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            const users = parsedData.users || [];
            
            // 현재 사용자 찾기
            const userIndex = users.findIndex((u: any) => u.id === user.id);
            
            if (userIndex >= 0 && users[userIndex].healthData) {
              // 약물 데이터 업데이트
              users[userIndex].healthData.medications = updated;
              
              // 업데이트된 데이터 저장
              parsedData.users = users;
              localStorage.setItem('silverHomeData', JSON.stringify(parsedData));
            }
          }
        } catch (err) {
          console.error('약물 데이터 삭제 오류:', err);
        }
      }
      
      return updated;
    });
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <FaArrowLeft className="mr-2" />
            <h1 className="text-2xl font-bold">건강관리</h1>
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
        {/* 탭 네비게이션 */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('bp')}
              className={`flex-1 py-4 px-4 text-center text-lg font-medium ${
                activeTab === 'bp' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaHeartbeat className="inline-block mr-2" />
              혈압 관리
            </button>
            <button
              onClick={() => setActiveTab('med')}
              className={`flex-1 py-4 px-4 text-center text-lg font-medium ${
                activeTab === 'med' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaPills className="inline-block mr-2" />
              복약 관리
            </button>
          </nav>
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
            {activeTab === 'bp' && (
              <div>
                {/* 혈압 입력 폼 */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">혈압 기록하기</h2>
                  
                  <form onSubmit={handleAddBloodPressure} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-1">
                          수축기 혈압 (mmHg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="systolic"
                          type="number"
                          min="60"
                          max="250"
                          value={bpForm.systolic}
                          onChange={(e) => setBpForm({...bpForm, systolic: e.target.value})}
                          placeholder="120"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-1">
                          이완기 혈압 (mmHg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="diastolic"
                          type="number"
                          min="40"
                          max="150"
                          value={bpForm.diastolic}
                          onChange={(e) => setBpForm({...bpForm, diastolic: e.target.value})}
                          placeholder="80"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="pulse" className="block text-sm font-medium text-gray-700 mb-1">
                          맥박 (bpm) <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="pulse"
                          type="number"
                          min="40"
                          max="200"
                          value={bpForm.pulse}
                          onChange={(e) => setBpForm({...bpForm, pulse: e.target.value})}
                          placeholder="70"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bp-date" className="block text-sm font-medium text-gray-700 mb-1">
                          측정일 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-gray-400" />
                          </div>
                          <input
                            id="bp-date"
                            type="date"
                            value={bpForm.date}
                            onChange={(e) => setBpForm({...bpForm, date: e.target.value})}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bp-note" className="block text-sm font-medium text-gray-700 mb-1">
                          메모
                        </label>
                        <input
                          id="bp-note"
                          type="text"
                          value={bpForm.note}
                          onChange={(e) => setBpForm({...bpForm, note: e.target.value})}
                          placeholder="예: 아침 식전, 운동 후 등"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaPlus className="mr-2" />
                        기록하기
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* 혈압 기록 목록 */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">혈압 기록</h2>
                  
                  {bloodPressures.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      혈압 기록이 없습니다.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              날짜
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              수축기/이완기
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              맥박
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              메모
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              삭제
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bloodPressures.map((bp) => (
                            <tr key={bp.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(bp.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-medium ${
                                  bp.systolic > 140 || bp.diastolic > 90 
                                    ? 'text-red-600' 
                                    : bp.systolic < 90 || bp.diastolic < 60
                                      ? 'text-blue-600'
                                      : 'text-green-600'
                                }`}>
                                  {bp.systolic}/{bp.diastolic} mmHg
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {bp.pulse} bpm
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {bp.note || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteBP(bp.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'med' && (
              <div>
                {/* 약물 입력 폼 */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">복약 기록하기</h2>
                  
                  <form onSubmit={handleAddMedication} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="med-name" className="block text-sm font-medium text-gray-700 mb-1">
                          약품명 <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="med-name"
                          type="text"
                          value={medForm.name}
                          onChange={(e) => setMedForm({...medForm, name: e.target.value})}
                          placeholder="약품명 입력"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                          용량 <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="dosage"
                          type="text"
                          value={medForm.dosage}
                          onChange={(e) => setMedForm({...medForm, dosage: e.target.value})}
                          placeholder="예: 5mg, 10ml 등"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        복용 주기 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="frequency"
                        type="text"
                        value={medForm.frequency}
                        onChange={(e) => setMedForm({...medForm, frequency: e.target.value})}
                        placeholder="예: 하루 3회, 식후 30분 등"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                          복용 시작일 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-gray-400" />
                          </div>
                          <input
                            id="start-date"
                            type="date"
                            value={medForm.startDate}
                            onChange={(e) => setMedForm({...medForm, startDate: e.target.value})}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                          복용 종료일
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-gray-400" />
                          </div>
                          <input
                            id="end-date"
                            type="date"
                            value={medForm.endDate}
                            onChange={(e) => setMedForm({...medForm, endDate: e.target.value})}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="med-note" className="block text-sm font-medium text-gray-700 mb-1">
                        메모
                      </label>
                      <textarea
                        id="med-note"
                        value={medForm.note}
                        onChange={(e) => setMedForm({...medForm, note: e.target.value})}
                        placeholder="복용 시 주의사항 등"
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaPlus className="mr-2" />
                        기록하기
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* 약물 기록 목록 */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">복약 기록</h2>
                  
                  {medications.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      복약 기록이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {medications.map((med) => (
                        <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{med.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{med.dosage} | {med.frequency}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteMed(med.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-700">
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-gray-500 mr-1" />
                              <span>
                                복용 기간: {formatDate(med.startDate)} {med.endDate ? `~ ${formatDate(med.endDate)}` : '~ 현재'}
                              </span>
                            </div>
                            
                            {med.note && (
                              <p className="mt-2 italic">
                                {med.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p> 2025 실버홈. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 인증된 사용자만 접근 가능한 건강관리 페이지
export default function HealthPage() {
  return (
    <AuthWrapper>
      <HealthContent />
    </AuthWrapper>
  );
}
