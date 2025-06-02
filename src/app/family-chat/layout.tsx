// 서버 컴포넌트 (Next.js 기본값)
import React from 'react';

export const metadata = {
  title: 'family-chat - 실버홈',
  description: '실버홈 family-chat 페이지입니다.'
};

export default function FamilyChatLayout({
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