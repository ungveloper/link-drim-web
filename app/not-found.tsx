import Link from "next/link";
import { Brand } from "@/components/ui/brand";
export default function NotFound(){return <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 text-center"><Brand/><p className="text-5xl font-extrabold text-[#8073CC]">404</p><h1 className="text-2xl font-bold">현재 사용할 수 없는 페이지입니다.</h1><p className="text-sm text-[#8A8F9D]">주소가 변경되었거나 페이지가 비공개로 전환되었을 수 있습니다.</p><Link href="/" className="mt-3 rounded-xl bg-[#272C40] px-6 py-3 text-sm font-bold text-white">링크드림 홈으로</Link></main>}
