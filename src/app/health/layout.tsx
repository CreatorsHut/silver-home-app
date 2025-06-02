// 서버 컴포넌트 (Next.js 기본값)
import React from 'react';

export const metadata = {
  title: 'health - 실버홈',
  description: '실버홈 health 페이지입니다.'
};

export default function HealthLayout({
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