"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BarChart3, Menu, PanelsTopLeft, X } from "lucide-react";
import { Brand } from "@/components/ui/brand";

type Site={id:string;name:string;slug:string};
export function DashboardShell({children,sites,selectedId}:{children:ReactNode;sites:Site[];selectedId:string}){
 const [open,setOpen]=useState(false);const pathname=usePathname(),router=useRouter();
 const items=[{href:"/dashboard",label:"성과 분석",Icon:BarChart3},{href:"/dashboard/manage",label:"페이지 관리",Icon:PanelsTopLeft}];
 const nav=<div className="flex h-full flex-col gap-8 p-6"><Brand/><nav className="space-y-2" aria-label="고객 관리 메뉴">{items.map(x=><Link key={x.href} onClick={()=>setOpen(false)} href={`${x.href}?site=${selectedId}`} className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold transition ${pathname===x.href?"bg-[#ECEAF8] text-[#6653BC]":"text-[#7C8291] hover:bg-[#F3F3F7]"}`}><x.Icon size={19}/>{x.label}</Link>)}</nav><div className="mt-auto border-t border-[#E8EAF0] pt-5"><Link href="/" className="text-xs font-semibold text-[#838A9A]">← 링크드림 홈</Link></div></div>;
 return <div className="min-h-[100dvh] lg:grid lg:grid-cols-[252px_1fr]"><aside className="hidden border-r border-[#E8EAF0] bg-white lg:block">{nav}</aside>
  {open&&<div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={()=>setOpen(false)}><aside onClick={e=>e.stopPropagation()} className="h-full w-64 bg-white">{nav}</aside></div>}
  <main className="min-w-0"><header className="flex min-h-20 items-center justify-between gap-3 border-b border-[#E8EAF0] bg-white px-5 sm:px-9"><div className="flex items-center gap-3"><button aria-label="메뉴 열기" className="rounded-lg border border-[#E8EAF0] p-2 lg:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div><span className="block text-xs text-[#A1A5B2]">현재 관리 중인 사이트</span><select aria-label="관리 사이트 변경" className="max-w-[235px] bg-transparent text-sm font-bold outline-none" value={selectedId} onChange={e=>router.push(`${pathname}?site=${e.target.value}`)}>{sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div></div><Link href="/dashboard/manage" className="text-xs font-semibold text-[#8D80D0]">내 페이지 관리</Link></header><div className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-9 sm:py-10">{children}</div></main>
 </div>;
}
