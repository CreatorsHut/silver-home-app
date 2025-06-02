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
        
        // 문제가 있는 SSR 설정 확인 (함수 형태로 인식되는 문제 해결)
        if (content.includes("export const dynamic = 'force-dynamic';") && 
            content.includes("export const dynamicParams = true;")) {
          // Next.js 15.3.3에 맞게 페이지 설정 수정
          const updatedContent = fixPageConfig(content);
          
          // 파일 덮어쓰기
          fs.writeFileSync(fullPath, updatedContent);
          console.log(`페이지 설정 수정 완료: ${fullPath}`);
        } else if (!content.includes("export const dynamic = 'force-dynamic'")) {
          // 아직 수정되지 않은 페이지는 SSR 비활성화 코드 추가
          const updatedContent = addSsrDisableCode(content);
          
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

// 페이지 설정 수정 함수 (Next.js 15.3.3 호환성)
function fixPageConfig(content) {
  // 문제가 되는 코드 패턴
  const dynamicExport = "export const dynamic = 'force-dynamic';";
  const dynamicParamsExport = "export const dynamicParams = true;";
  
  // 수정된 코드 (문자열을 직접 상수로 설정)
  const fixedDynamicExport = "export const dynamic = 'force-dynamic';";
  const fixedConfig = "// Next.js 15.3.3 호환성을 위한 페이지 설정\n// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기\nexport const config = {\n  dynamic: 'force-dynamic'\n};";
  
  // 기존 설정 제거 및 새 설정 추가
  let newContent = content.replace(dynamicExport, "");
  newContent = newContent.replace(dynamicParamsExport, "");
  
  // 'use client' 지시어 찾기
  const useClientIndex = newContent.indexOf("'use client'");
  const isUseClientWithQuotes = useClientIndex !== -1;
  
  // 따옴표 종류에 따른 'use client' 선언
  const useClientDeclaration = isUseClientWithQuotes ? "'use client'" : '"use client"';
  const useClientIndexActual = isUseClientWithQuotes ? useClientIndex : newContent.indexOf('"use client"');
  
  // 'use client' 다음 줄에 새 설정 코드 삽입
  const contentBeforeUseClient = newContent.substring(0, useClientIndexActual + useClientDeclaration.length);
  const contentAfterUseClient = newContent.substring(useClientIndexActual + useClientDeclaration.length);
  
  return contentBeforeUseClient + "\n\n" + fixedConfig + contentAfterUseClient;
}

// 클라이언트 컴포넌트 페이지 수정 함수
function addSsrDisableCode(content) {
  // 'use client' 지시어 위치 찾기
  const useClientIndex = content.indexOf("'use client'");
  const isUseClientWithQuotes = useClientIndex !== -1;
  
  // 따옴표 종류에 따른 'use client' 선언
  const useClientDeclaration = isUseClientWithQuotes ? "'use client'" : '"use client"';
  const useClientIndexActual = isUseClientWithQuotes ? useClientIndex : content.indexOf('"use client"');
  
  // 'use client' 다음 줄에 SSR 비활성화 코드 삽입
  const contentBeforeUseClient = content.substring(0, useClientIndexActual + useClientDeclaration.length);
  const contentAfterUseClient = content.substring(useClientIndexActual + useClientDeclaration.length);
  
  // Next.js 15.3.3에 맞는 페이지 설정 코드
  const ssrDisableCode = `\n\n// Next.js 15.3.3 호환성을 위한 페이지 설정\n// 페이지 구성 오류를 방지하기 위해 객체 형태로 내보내기\nexport const config = {\n  dynamic: 'force-dynamic'\n};`;
  
  return contentBeforeUseClient + ssrDisableCode + contentAfterUseClient;
}

// 스크립트 실행
console.log('클라이언트 컴포넌트 페이지 수정 시작...');
findAndUpdateClientPages(appDir);
console.log('모든 클라이언트 컴포넌트 페이지 수정 완료!');
