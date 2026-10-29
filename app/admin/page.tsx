import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { Brand } from "@/components/ui/brand";
import { AdminConsole, type AdminSite } from "@/components/dashboard/admin-console";
import { Panel } from "@/components/ui/panel";
export default async function AdminPage(){
 await requireAdmin();const db=getAdminClient();const [{data:sites},{data:members},{data:issues}]=await Promise.all([
 db.from("sites").select("id,slug,name,status").order("created_at",{ascending:false}).limit(150),
 db.from("site_members").select("site_id,user_id").limit(1000),
 db.from("site_issues").select("id,category,message,state,occurrence_count,last_seen_at").order("last_seen_at",{ascending:false}).limit(25)
 ]);
 const rows=(sites||[]).map(s=>({...s,members:(members||[]).filter(m=>m.site_id===s.id)})) as AdminSite[];
 return <div className="min-h-screen bg-[#F8F9FC]"><header className="flex items-center justify-between border-b bg-white px-5 py-6 sm:px-10"><Brand/><Link href="/dashboard" className="text-sm font-bold text-[#8171CC]">고객 화면 보기</Link></header><main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-10"><div><p className="text-xs font-bold tracking-widest text-[#8574CF]">SUPER ADMIN</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">링크드림 운영 관리</h1><p className="mt-2 text-sm text-[#8F95A5]">고객 사이트·초대·운영 오류를 관리합니다. 고객은 이 화면에 접근할 수 없습니다.</p></div><div><Link href="/admin/history" className="inline-flex rounded-xl border border-[#DDDDE8] bg-white px-4 py-3 text-sm font-bold text-[#6856BC]">변경 이력 · 비교 · 복구 관리 →</Link></div><AdminConsole sites={rows}/><Panel title="최근 운영 오류" description="동일 오류는 fingerprint 기준으로 묶어 기록합니다.">{issues?.length?<div className="space-y-3">{issues.map(i=><div key={i.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[#EBEDF2] p-4"><div><p className="text-sm font-bold">{i.category} · {i.state}</p><p className="mt-1 break-all text-xs text-[#868D9A]">{i.message}</p></div><span className="text-xs text-[#A0A5B2]">{i.occurrence_count}회 · {new Date(i.last_seen_at).toLocaleDateString("ko-KR")}</span></div>)}</div>:<p className="text-sm text-[#979BA8]">아직 오류 기록이 없습니다.</p>}</Panel></main></div>;
}
