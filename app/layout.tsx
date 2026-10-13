import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "센테를 평가해 주세요",
  description: "사천의 선인 인터랙티브 관객 평가",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
