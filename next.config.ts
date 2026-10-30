import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 화면 구석의 Next.js 개발 표시를 숨긴다. 컴파일 오류와 실행 오류는 그대로 화면에 뜬다.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
