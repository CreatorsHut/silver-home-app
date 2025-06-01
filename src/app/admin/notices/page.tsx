'use client';

import { useState, useEffect } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppContext';
import { Notice, getDataFromStorage, saveDataToStorage } from '@/data/models';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSearch, FaThumbtack, FaRegCalendarAlt } from 'react-icons/fa';

function NoticesContent() {
  const { user, isAdmin } = useAuth();
  const { data } = useAppData();
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    name: string;
    content: string;
    category: string;
    isPinned: boolean;
    attachments: any[]; // Attachment[] 형태로 사용되지만 경우에 따라 문자열도 포함할 수 있음
  }>({
    title: '',
    name: '',  // title과 호환되는 필드
    content: '',
    category: '공지',
    isPinned: false,
    attachments: [], 
  });
  
  // 카테고리 목록
  const categories = ['공지', '행사', '안내', '긴급', '건강', '기타'];
  
  // 관리자 권한 확인
  useEffect(() => {
    // AuthWrapper가 인증을 처리하고 isAdmin 값을 확인
    if (typeof window !== 'undefined' && user && !isAdmin()) {
      window.location.href = '/dashboard';
      return;
    }
  }, [user, isAdmin]);
  
  // 공지사항 데이터 로드
  useEffect(() => {
    if (!data || !data.notices) return;
    
    setNotices(data.notices);
  }, [data]);
  
  // 공지사항 필터링
  const filteredNotices = notices?.filter(notice => {
    if (!notice) return false;
    
    const matchesSearch = notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notice.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  // 날짜 형식 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // 공지사항 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      name: '',
      content: '',
      category: '공지',
      isPinned: false,
      attachments: [],
    });
    setCurrentNotice(null);
  };
  
  // 모달 열기 (새 공지)
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  
  // 모달 열기 (수정)
  const openEditModal = (notice: Notice) => {
    setCurrentNotice(notice);
    
    // attachments 필드 안전하게 처리 (문자열 또는 Attachment 객체 모두 처리)
    let attachmentsValue: any[] = [];
    
    if (notice?.attachments && Array.isArray(notice.attachments)) {
      attachmentsValue = notice.attachments.map(attachment => {
        // 문자열인 경우 Attachment 객체로 변환
        if (typeof attachment === 'string') {
          return {
            name: attachment,
            url: attachment
          };
        }
        // 이미 Attachment 객체인 경우 그대로 사용
        return attachment;
      });
    }
      
    setFormData({
      title: notice?.title || '',
      name: notice?.name || notice?.title || '',
      content: notice?.content || '',
      category: notice?.category || '공지',
      isPinned: notice?.isPinned || false,
      attachments: attachmentsValue,
    });
    setIsModalOpen(true);
  };
  
  // 삭제 모달 열기
  const openDeleteModal = (notice: Notice) => {
    setCurrentNotice(notice);
    setIsDeleteModalOpen(true);
  };
  
  // 폼 입력값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: target.type === 'checkbox' ? target.checked : value
    }));
  };
  
  // 공지사항 저장
  const handleSaveNotice = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    try {
      // 로컬 스토리지에서 데이터 가져오기
      const appData = getDataFromStorage();
      
      if (currentNotice) {
        // 기존 공지사항 수정
        const updatedNotices = appData.notices?.map(notice => {
          if (notice?.id === currentNotice?.id) {
            return {
              ...notice,
              title: formData?.title || '',
              name: formData?.title || '', // title과 동일한 값 유지
              content: formData?.content || '',
              category: formData?.category || '공지',
              isPinned: formData?.isPinned || false,
              attachments: (formData?.attachments || []).map(attachment => {
                if (typeof attachment === 'string') {
                  return { name: attachment, url: attachment };
                }
                return attachment;
              }),
              updatedAt: new Date().toISOString(),
              // 작성자 정보 유지
              authorId: notice.authorId || user?.id || '',
              authorName: notice.authorName || user?.name || '관리자',
            };
          }
          return notice;
        });
        
        appData.notices = updatedNotices;
      } else {
        // 새 공지사항 추가
        const now = new Date().toISOString();
        const newNotice: Notice = {
          id: `notice-${Date.now()}`,
          title: formData.title,
          name: formData.title, // title과 동일한 값 유지
          content: formData.content,
          category: formData.category,
          createdAt: now,
          updatedAt: now,
          author: user?.name || '관리자',
          authorId: user?.id || '',
          authorName: user?.name || '관리자',
          isPinned: formData.isPinned,
          attachments: (formData.attachments || []).map(attachment => {
            if (typeof attachment === 'string') {
              return { name: attachment, url: attachment };
            }
            return attachment;
          }),
        };
        
        appData.notices = Array.isArray(appData.notices) ? [newNotice, ...appData.notices] : [newNotice];
      }
      
      // 업데이트된 데이터 저장
      saveDataToStorage(appData);
      
      // UI 상태 업데이트
      setNotices(appData.notices);
      setIsModalOpen(false);
      resetForm();
      
      alert(currentNotice ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
    } catch (err) {
      console.error('공지사항 저장 오류:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };
  
  // 공지사항 삭제
  const handleDeleteNotice = () => {
    if (!currentNotice) return;
    
    try {
      // 로컬 스토리지에서 데이터 가져오기
      const appData = getDataFromStorage();
      
      // 공지사항 삭제
      const updatedNotices = appData.notices?.filter(notice => notice?.id !== currentNotice?.id) || [];
      
      // 업데이트된 데이터 저장
      appData.notices = updatedNotices;
      saveDataToStorage(appData);
      
      // UI 상태 업데이트
      setNotices(updatedNotices);
      setIsDeleteModalOpen(false);
      setCurrentNotice(null);
      
      alert('공지사항이 삭제되었습니다.');
    } catch (err) {
      console.error('공지사항 삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };
  
  // 권한 없으면 로딩 표시
  if (!user || !isAdmin()) {
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
            <Link href="/admin/dashboard" className="mr-4 text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="공지사항 검색..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="ml-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">전체 카테고리</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={openCreateModal}
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            새 공지사항
          </button>
        </div>
        
        {/* 공지사항 목록 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredNotices.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotices.map(notice => (
                <div key={notice.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                          notice.category === '긴급' ? 'bg-red-100 text-red-800' :
                          notice.category === '공지' ? 'bg-blue-100 text-blue-800' :
                          notice.category === '행사' ? 'bg-green-100 text-green-800' :
                          notice.category === '건강' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notice.category}
                        </span>
                        <h3 className="text-lg font-bold">
                          {notice.title}
                        </h3>
                        {notice.isPinned && (
                          <FaThumbtack className="text-red-500 ml-2" />
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3 flex items-center">
                        <span>{notice.authorName}</span>
                        <span className="mx-2">•</span>
                        <FaRegCalendarAlt className="mr-1" />
                        <span>{formatDate(notice.createdAt)}</span>
                        {notice.createdAt !== notice.updatedAt && (
                          <span className="ml-2 text-xs">(수정됨)</span>
                        )}
                      </div>
                      
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="text-gray-700 line-clamp-3">{notice.content}</p>
                      </div>
                      
                      {notice.attachments && notice.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">첨부파일:</p>
                          <div className="flex flex-wrap gap-2">
                            {notice.attachments.map((attachment, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {typeof attachment === 'string' 
                                  ? attachment 
                                  : attachment.name || `첨부파일 ${index + 1}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(notice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="수정"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(notice)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-2">다른 검색어나 카테고리로 다시 시도해보세요.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* 공지사항 생성/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {currentNotice ? '공지사항 수정' : '새 공지사항 작성'}
                </h3>
                <div className="mt-2">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        제목 <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        카테고리
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPinned"
                        name="isPinned"
                        checked={formData.isPinned}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-700">
                        상단 고정
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        내용 <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={8}
                        value={formData.content}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        첨부파일
                      </label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          id="attachments"
                          className="sr-only"
                          multiple
                        />
                        <label
                          htmlFor="attachments"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          파일 선택
                        </label>
                        <p className="ml-2 text-xs text-gray-500">
                          * 현재 데모 버전에서는 파일 첨부 기능이 제한됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleSaveNotice}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                >
                  {currentNotice ? '수정하기' : '등록하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && currentNotice && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FaTrash className="h-5 w-5 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    공지사항 삭제
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteNotice}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  삭제
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCurrentNotice(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2025 실버홈 관리자 시스템. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

// 서버 사이드 렌더링 중 클라이언트 컴포넌트 함수 호출 방지
export const dynamic = 'force-dynamic';
export const generateViewport = null; // 서버에서 호출되지 않도록 설정
