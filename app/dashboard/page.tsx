import { BarChart3, Eye, MousePointerClick, Users, Clock3 } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { DashboardShell } from "@/components/dashboard/shell";
import { loadDashboard } from "@/lib/dashboard";
import { getAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { connection } from "next/server";

// Called after connection() so the rolling analytics range is calculated per request.
function getAnalyticsWindowStart(days:number):string {
 return new Date(Date.now()-days*24*60*60*1000).toISOString();
}
export default async function AnalyticsPage({searchParams}:{searchParams:Promise<{site?:string;range?:string}>}){
 const q=await searchParams;const {sites,selected}=await loadDashboard(q.site);
 if(!selected)return <div className="mx-auto max-w-xl px-6 py-24 text-center"><BarChart3 className="mx-auto text-[#8F87CE]" size={44}/><h1 className="mt-6 text-2xl font-bold">연결된 사이트가 없습니다</h1><p className="mt-3 text-sm leading-7 text-[#7C8291]">최고 관리자에게 초대 링크를 요청해 주세요.</p><Link href="/" className="mt-7 inline-block text-[#6B5EB5] underline">홈으로 이동</Link></div>;
 const days=q.range==="30"?30:q.range==="365"?365:90;
 await connection();
 const since=getAnalyticsWindowStart(days);
 const {data}=await getAdminClient().from("visit_events").select("kind,template_key,target,session_id,source,occurred_at").eq("site_id",selected.id).gte("occurred_at",since).order("occurred_at",{ascending:false}).limit(15000);
 const events=data||[],views=events.filter(e=>e.kind==="view"),clicks=events.filter(e=>["link","social","phone","email"].includes(e.kind));
 const sessions=new Set(views.map(e=>e.session_id)).size;
 const durations=events.filter(e=>e.kind==="duration").map(e=>Number(e.target)).filter(n=>Number.isFinite(n)&&n>=0&&n<=600);const avgDuration=durations.length?Math.round(durations.reduce((a,b)=>a+b,0)/durations.length):0;
 const counts=new Map<string,number>();clicks.forEach(e=>counts.set(e.target,(counts.get(e.target)||0)+1));
 const ranking=[...counts].sort((a,b)=>b[1]-a[1]).slice(0,5);
 const sources=new Map<string,number>();views.forEach(e=>sources.set(e.source||"직접 접속 / 알 수 없음",(sources.get(e.source||"직접 접속 / 알 수 없음")||0)+1));
 const cards=[{name:"페이지 조회",value:views.length,Icon:Eye},{name:"방문 세션(추정)",value:sessions,Icon:Users},{name:"링크·행동 클릭",value:clicks.length,Icon:MousePointerClick},{name:"클릭률",value:views.length?`${Math.round(clicks.length/views.length*100)}%`:"0%",Icon:Clock3},{name:"평균 체류(추정)",value:`${avgDuration}초`,Icon:Clock3}];
 return <DashboardShell sites={sites} selectedId={selected.id}><div><p className="text-sm font-semibold text-[#8176CA]">ANALYTICS</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">성과 분석</h1><p className="mt-2 text-sm text-[#838999]">{days}일간의 고객 행동을 간단히 확인하세요. 통계는 추정치이며 일부 이벤트가 누락될 수 있습니다.</p><div className="mt-4 flex flex-wrap gap-2">{[30,90,365].map(n=><Link key={n} href={`/dashboard?site=${selected.id}&range=${n}`} className={`rounded-lg px-4 py-2 text-xs font-bold ${days===n?"bg-[#292E43] text-white":"border border-[#DFE1E9] bg-white text-[#777D8B]"}`}>{n===365?"1년":`${n}일`}</Link>)}</div></div>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cards.map(c=><div key={c.name} className="rounded-[20px] border border-[#E6E8EF] bg-white p-5"><c.Icon className="text-[#8F83CF]" size={20}/><p className="mt-4 text-sm text-[#858B98]">{c.name}</p><p className="mt-2 text-3xl font-extrabold">{typeof c.value==="number"?c.value.toLocaleString("ko-KR"):c.value}</p></div>)}</div>
  <Panel title="한눈에 보는 성과" description="많은 숫자 대신 핵심 결과부터 보여드려요."><div className="rounded-2xl bg-[#F4F2FD] px-5 py-5 text-sm leading-7 text-[#655A93]">{views.length?`${days}일 동안 ${views.length.toLocaleString("ko-KR")}회의 페이지 조회가 있었어요. 가장 많이 선택된 행동은 '${ranking[0]?.[0]||"없음"}'입니다.`:"아직 수집된 방문 데이터가 없습니다. 공개 페이지를 SNS에 공유해보세요."}</div></Panel>
  <div className="grid gap-5 lg:grid-cols-2"><Panel title="인기 링크 TOP 5">{ranking.length?ranking.map(([name,count],i)=><div key={name} className="mb-5 flex items-center gap-3 text-sm"><span className="w-5 font-bold text-[#9EA2B2]">{i+1}</span><span className="min-w-0 flex-1 truncate">{name}</span><span className="font-bold">{count}회</span></div>):<p className="text-sm text-[#999EAD]">아직 클릭 데이터가 없습니다.</p>}</Panel><Panel title="유입 채널">{sources.size?[...sources].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,count])=><div className="mb-5 flex items-center justify-between text-sm" key={name}><span>{name}</span><strong>{count}회</strong></div>):<p className="text-sm text-[#999EAD]">아직 유입 데이터가 없습니다.</p>}</Panel></div>
  <p className="text-xs leading-6 text-[#A0A4B1]">미리보기는 측정하지 않으며, 고유 사용자를 추적하는 대신 익명 세션을 이용합니다. 전화 클릭과 실제 통화 연결, 예약 버튼 클릭과 예약 완료는 서로 다릅니다.</p>
 </DashboardShell>;
}
