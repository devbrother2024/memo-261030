import type { MetadataRoute } from "next";

// 휴대폰 홈 화면에 추가하면 주소창 없이 앱처럼 열린다.
// 색은 디자인 토큰 값이다: background_color는 surface/page, theme_color는 color/primary.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "메모",
    short_name: "메모",
    description: "메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f4f6",
    theme_color: "#3182f6",
    icons: [
      { src: "/icons/app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/app-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
