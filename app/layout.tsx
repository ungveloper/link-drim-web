import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "링크드림 | 나를 소개하는 링크를 드림", template: "%s | 링크드림" },
  description: "하나의 정보로 프로필, 디지털 명함, 멀티링크를 만드는 개인 브랜딩 플랫폼",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://linkdrim.com"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#F7F8FA] font-sans text-[#20232D] antialiased">
        {children}
        <Toaster richColors position="bottom-right" closeButton />
      </body>
    </html>
  );
}
