// 서버 컴포넌트 (Next.js 기본값)
import React from 'react';

export const metadata = {
  title: '가족 연락처 - 실버홈',
  description: '실버홈 가족 연락처 및 화상통화 페이지입니다.'
};

export default function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
