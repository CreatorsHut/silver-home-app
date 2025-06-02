const fs = require('fs');
const path = require('path');

// 애플리케이션 루트 디렉토리
const appDir = path.join(__dirname, 'src', 'app');

// 모든 'use client' 페이지 파일을 찾아 수정하는 함수
function findAndUpdateClientPages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // 디렉토리면 재귀적으로 탐색
      findAndUpdateClientPages(fullPath);
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'page.js') {
      // page 파일인 경우 내용 확인
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // 'use client' 지시어가 있는지 확인
      if (content.includes("'use client'") || content.includes('"use client"')) {
        console.log(`클라이언트 컴포넌트 발견: ${fullPath}`);
        
        // 이미 dynamic 설정이 있는지 확인
        if (!content.includes("export const dynamic = 'force-dynamic'")) {
          // 클라이언트 컴포넌트 페이지 수정
          const updatedContent = updateClientPage(content);
          
          // 파일 덮어쓰기
          fs.writeFileSync(fullPath, updatedContent);
          console.log(`파일 수정 완료: ${fullPath}`);
        } else {
          console.log(`이미 수정됨: ${fullPath}`);
        }
      }
    }
  }
}

// 클라이언트 컴포넌트 페이지 수정 함수
function updateClientPage(content) {
  // 'use client' 지시어 위치 찾기
  const useClientIndex = content.indexOf("'use client'");
  const isUseClientWithQuotes = useClientIndex !== -1;
  
  // 따옴표 종류에 따른 'use client' 선언
  const useClientDeclaration = isUseClientWithQuotes ? "'use client'" : '"use client"';
  const useClientIndexActual = isUseClientWithQuotes ? useClientIndex : content.indexOf('"use client"');
  
  // 'use client' 다음 줄에 SSR 비활성화 코드 삽입
  const contentBeforeUseClient = content.substring(0, useClientIndexActual + useClientDeclaration.length);
  const contentAfterUseClient = content.substring(useClientIndexActual + useClientDeclaration.length);
  
  const ssrDisableCode = `
  
// Next.js 15에서 SSR 비활성화 (클라이언트에서만 실행되도록 설정)
// 이렇게 하면 서버에서 generateViewport 호출하는 문제 방지
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
`;
  
  return contentBeforeUseClient + ssrDisableCode + contentAfterUseClient;
}

// 스크립트 실행
console.log('클라이언트 컴포넌트 페이지 수정 시작...');
findAndUpdateClientPages(appDir);
console.log('모든 클라이언트 컴포넌트 페이지 수정 완료!');
