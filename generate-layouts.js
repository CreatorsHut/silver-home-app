const fs = require('fs');
const path = require('path');

// Next.js 앱 디렉토리 경로
const appDir = path.join(__dirname, 'src', 'app');

// 디렉토리 내의 모든 파일과 하위 디렉토리를 재귀적으로 확인하는 함수
function processDirectory(dirPath) {
  // 디렉토리 내의 모든 항목 읽기
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // 하위 디렉토리의 경우 재귀적으로 처리
      processDirectory(itemPath);
    } else if (item === 'page.tsx' || item === 'page.jsx') {
      // page.tsx 또는 page.jsx 파일을 찾았을 때
      const content = fs.readFileSync(itemPath, 'utf8');
      
      // 'use client' 지시문이 있는지 확인
      if (content.includes("'use client'") || content.includes('"use client"')) {
        const dirName = path.basename(dirPath);
        const layoutPath = path.join(dirPath, 'layout.tsx');
        
        // 이미 layout.tsx 파일이 있는지 확인
        if (!fs.existsSync(layoutPath)) {
          console.log(`'${dirPath}' 경로에 layout.tsx 파일 생성 중...`);
          
          // layout.tsx 파일 생성
          const layoutContent = `// 서버 컴포넌트 (Next.js 기본값)
import React from 'react';

export const metadata = {
  title: '${dirName} - 실버홈',
  description: '실버홈 ${dirName} 페이지입니다.'
};

export default function ${dirName.charAt(0).toUpperCase() + dirName.slice(1)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}`;
          
          fs.writeFileSync(layoutPath, layoutContent);
          console.log(`'${layoutPath}' 파일이 성공적으로 생성되었습니다.`);
        } else {
          console.log(`'${layoutPath}' 파일이 이미 존재합니다.`);
        }
      }
    }
  }
}

// 앱 디렉토리 처리 시작
console.log('Next.js 앱 디렉토리 처리 중...');
processDirectory(appDir);
console.log('처리 완료!');
