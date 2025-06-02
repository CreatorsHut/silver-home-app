/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정
  reactStrictMode: true,
  
  // 빌드 오류 무시 설정
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 배포 설정
  output: 'standalone',
  trailingSlash: false,
  
  // 이미지 설정
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // SSR 관련 문제 해결
  experimental: {
    // 서버 액션 사용 설정 (boolean으로 지정)
    serverActions: true
  },
  
  // 서버 컴포넌트 외부 패키지 설정 (Next.js 15.3.3에서 이동됨)
  serverExternalPackages: [],
  
  // generateViewport 문제 해결을 위한 설정
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
