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
import { Notice, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaUser, FaBell, FaSearch, FaFilter, FaThumbtack } from 'react-icons/fa';

function NoticesContent() {
  const { user } = useAuth();
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // 카테고리 옵션
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'announcement', name: '공지사항' },
    { id: 'event', name: '행사' },
    { id: 'facility', name: '시설' },
    { id: 'emergency', name: '긴급' },
    { id: 'other', name: '기타' }
  ];

  // 데이터 로딩
  useEffect(() => {
    // getDataFromStorage 유틸 함수를 사용하여 공지사항 데이터 가져오기
    try {
      if (typeof window !== 'undefined') {
        const appData = getDataFromStorage();
        setNotices(appData.notices || []);
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);  // 의존성 제거

  // 공지사항 필터링
  useEffect(() => {
    let result = [...notices];
    
    // 검색어로 필터링
    if (searchQuery) {
      result = result.filter(notice => 
        notice?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        notice?.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 카테고리로 필터링
    if (filterCategory !== 'all') {
      result = result.filter(notice => notice?.category === filterCategory);
    }
    
    // 중요 공지사항을 상단에 배치하고, 그 다음 날짜순 정렬
    result.sort((a, b) => {
      if (a?.isPinned && !b?.isPinned) return -1;
      if (!a?.isPinned && b?.isPinned) return 1;
      return new Date(b?.createdAt || '').getTime() - new Date(a?.createdAt || '').getTime();
    });
    
    setFilteredNotices(result);
  }, [notices, searchQuery, filterCategory]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
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
            <h1 className="text-2xl font-bold">공지사항</h1>
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
        {/* 검색 및 필터링 폼 */}
        {!selectedNotice && (
          <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="공지사항 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="md:w-1/3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 appearance-none bg-none"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedNotice ? (
          // 공지사항 상세 보기
          <div className="bg-white shadow-md rounded-lg p-6">
            <button 
              onClick={() => setSelectedNotice(null)}
              className="mb-4 inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200"
            >
              <FaArrowLeft className="mr-1" /> 목록으로 돌아가기
            </button>
            
            <div className="border-b pb-4 mb-4">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedNotice?.isPinned && (
                    <FaThumbtack className="inline-block mr-2 text-red-600" />
                  )}
                  {selectedNotice?.title}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedNotice?.category === 'announcement' ? 'bg-blue-100 text-blue-800' :
                  selectedNotice?.category === 'event' ? 'bg-green-100 text-green-800' :
                  selectedNotice?.category === 'facility' ? 'bg-purple-100 text-purple-800' :
                  selectedNotice?.category === 'emergency' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {categories.find(c => c.id === selectedNotice?.category)?.name || '기타'}
                </span>
              </div>
              
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                <span className="mr-4">작성자: {selectedNotice?.author || '알 수 없음'}</span>
                <span>게시일: {formatDate(selectedNotice?.createdAt || '')}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mt-6">
              <p className="whitespace-pre-line">{selectedNotice?.content || ''}</p>
            </div>
            
            {selectedNotice?.attachments && selectedNotice?.attachments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">첨부 파일</h3>
                <ul className="space-y-2">
                  {selectedNotice?.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <a href={typeof attachment === 'string' ? '#' : attachment.url || '#'} 
                         className="text-blue-600 hover:text-blue-800">
                        {typeof attachment === 'string' 
                          ? attachment 
                          : attachment.name || `첨부파일 ${index + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // 공지사항 목록
          <div>
            {/* 검색 및 필터 */}
            <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-900">공지사항 목록</h2>
                
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="제목 검색"
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
              <div className="space-y-4">
                {filteredNotices.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <FaBell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">공지사항이 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery || filterCategory !== 'all' 
                        ? '검색 조건에 맞는 공지사항이 없습니다.' 
                        : '등록된 공지사항이 없습니다.'}
                    </p>
                  </div>
                ) : (
                  filteredNotices.map((notice) => (
                    <div 
                      key={notice.id} 
                      onClick={() => setSelectedNotice(notice)}
                      className={`block bg-white shadow-sm rounded-lg p-6 hover:shadow-md cursor-pointer transition-shadow ${
                        notice.isPinned ? 'border-l-4 border-red-500' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            {notice.isPinned && (
                              <FaThumbtack className="text-red-600 mr-2" />
                            )}
                            {notice.title}
                          </h3>
                          <div className="mt-1 text-sm text-gray-600 flex items-center flex-wrap">
                            <span className="mr-4">작성자: {notice.author}</span>
                            <span>게시일: {formatDate(notice.createdAt)}</span>
                          </div>
                          <p className="mt-2 text-gray-700 line-clamp-2">
                            {notice.content}
                          </p>
                        </div>
                        
                        <div className="mt-2 md:mt-0 md:ml-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            notice.category === 'announcement' ? 'bg-blue-100 text-blue-800' :
                            notice.category === 'event' ? 'bg-green-100 text-green-800' :
                            notice.category === 'facility' ? 'bg-purple-100 text-purple-800' :
                            notice.category === 'emergency' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {categories.find(c => c.id === notice.category)?.name || '기타'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
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

// 인증된 사용자만 접근 가능한 공지사항 페이지
export default function NoticesPage() {
  return (
    <AuthWrapper>
      <NoticesContent />
    </AuthWrapper>
  );
}
