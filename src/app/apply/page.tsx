'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      // application 페이지로 리디렉션
      router.replace('/application');
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg">리디렉션 중...</p>
      </div>
    </div>
  );
}
