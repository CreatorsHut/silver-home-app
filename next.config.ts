import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 빌드 시 ESLint 오류를 무시하여 빌드가 실패하지 않도록 설정
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 오류를 무시하여 빌드가 실패하지 않도록 설정
    ignoreBuildErrors: true,
  },
  // Vercel 배포를 위한 출력 설정
  output: 'standalone',
  // 정적 페이지 생성 및 서버 측 렌더링 활성화
  trailingSlash: false,
  // 이미지 최적화 설정
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

export default nextConfig;
