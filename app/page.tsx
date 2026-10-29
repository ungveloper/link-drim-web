import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, Check, Link2, MoveUpRight, Sparkles, UserRound } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { primaryButton } from "@/components/ui/panel";

const offers = [
  { icon: UserRound, title: "프로필 페이지", desc: "당신의 경력과 이야기를 한눈에", href: "/demo/profile" },
  { icon: BriefcaseBusiness, title: "디지털 명함", desc: "연락처·소개·SNS를 명함 한 장에", href: "/demo/business-card" },
  { icon: Link2, title: "멀티링크", desc: "흩어진 채널과 콘텐츠를 하나의 링크로", href: "/demo/link" },
];
export default function Home() {
  return <div className="min-h-screen bg-[#F8F8FC]">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8"><Brand /><Link className="rounded-full border border-[#E2E2EB] bg-white px-5 py-2.5 text-sm font-bold hover:border-[#BAB5DA]" href="/login">관리자 로그인</Link></header>
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div><span className="inline-flex items-center gap-2 rounded-full bg-[#ECE9FF] px-4 py-2 text-xs font-bold text-[#7055C8]"><Sparkles size={14}/> 홀로기업이 만든 개인 브랜딩 플랫폼</span>
          <h1 className="mt-7 text-4xl font-extrabold leading-[1.22] tracking-[-0.06em] text-[#232536] sm:text-6xl">당신을 소개하는<br/><span className="text-[#8168DB]">링크를 드림.</span></h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-[#666C7D] sm:text-lg">정보는 한 번만 입력하세요. 프로필, 명함, 멀티링크까지 원하는 템플릿이 알아서 완성됩니다. 관리도 복잡한 메뉴 없이 쉽고 간편하게.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/login" className={primaryButton}>내 페이지 관리하기 <ArrowRight size={16}/></Link><Link href="#templates" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#DEE0E8] bg-white px-5 text-sm font-bold">템플릿 살펴보기 <MoveUpRight size={16}/></Link></div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#777D8D]">{["한 번 입력하면 모든 템플릿에 반영", "모바일에서도 편집", "쉽게 읽는 성과 분석"].map(t=><span className="inline-flex items-center gap-1.5" key={t}><Check size={14} className="text-[#806CE2]"/>{t}</span>)}</div>
        </div>
        <div aria-label="링크드림 페이지 미리보기" className="relative mx-auto w-full max-w-[420px] rounded-[40px] border border-[#E5E3F1] bg-gradient-to-br from-[#E9E7F9] via-white to-[#F3E9F4] p-6 shadow-[0_35px_100px_rgba(68,59,116,0.12)] sm:p-10">
          <div className="rounded-[30px] bg-white p-8 text-center shadow-[0_10px_45px_rgba(49,49,84,0.10)]"><div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#EFEAFF] text-[#8063CA]"><UserRound size={35}/></div><p className="mt-5 text-xl font-extrabold">나만의 브랜드</p><p className="mt-2 text-sm text-[#848698]">나를 소개하는 온라인 공간</p><div className="mt-7 space-y-3">{["나의 이야기", "디지털 명함", "인스타그램", "상담 및 문의"].map((x,i)=><div key={x} className={"rounded-xl px-5 py-4 text-sm font-bold "+(i===0?"bg-[#2A2D41] text-white":"bg-[#F4F3FA] text-[#47475D]")}>{x}</div>)}</div></div>
          <span className="absolute -bottom-5 -left-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold shadow-lg"><BarChart3 size={19} className="text-[#8168DB]"/> 방문과 클릭까지 분석</span>
        </div>
      </section>
      <section id="templates" className="bg-white px-5 py-24 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold text-[#806CE2]">TEMPLATES</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">당신의 목적에 맞는 세 가지 모습</h2><p className="mt-4 text-[#777D8C]">필요한 페이지를 선택하고 같은 정보를 공유하세요.</p><div className="mt-10 grid gap-5 md:grid-cols-3">{offers.map(x=><article key={x.title} className="rounded-[24px] border border-[#EAECF0] bg-[#FBFBFD] p-7"><div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#7563C4]"><x.icon size={23}/></div><h3 className="mt-6 text-xl font-bold">{x.title}</h3><p className="mt-3 text-sm text-[#777D8D]">{x.desc}</p><Link className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#7460C8]" href={x.href}>디자인 보기 <ArrowRight size={16}/></Link></article>)}</div></div></section>
    </main><footer className="px-5 py-8 text-center text-xs text-[#9699A4]">LinkDrim · by 홀로기업 · linkdrim.com</footer>
  </div>;
}
