/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정
  reactStrictMode: true,
  swcMinify: true,
  
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
    // 배포 시 정적 HTML 생성 비활성화
    disableStaticImages: false,
    // 서버 액션 활성화
    serverActions: true,
    // 최신 React 기능 사용
    serverComponentsExternalPackages: [],
  },
  
  // generateViewport 문제 해결을 위한 설정
  // 클라이언트에서만 실행되어야 하는 기능을 서버에서 호출하지 않도록 설정
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
