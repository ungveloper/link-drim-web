import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { HistoryViewer } from "@/components/dashboard/history-viewer";
export default async function AdminHistory({searchParams}:{searchParams:Promise<{site?:string}>}){
 await requireAdmin();const {site}=await searchParams;const admin=getAdminClient();const {data:sites}=await admin.from("sites").select("id,name").order("created_at",{ascending:false});const chosen=sites?.find(x=>x.id===site)||sites?.[0];
 const {data:history}=chosen?await admin.from("site_history").select("id,site_id,revision,operation,actor_id,snapshot,created_at").eq("site_id",chosen.id).order("revision",{ascending:false}).limit(100):{data:[]};
 return <main className="mx-auto max-w-6xl space-y-7 px-5 py-10"><Link href="/admin" className="text-sm font-bold text-[#8071C6]">← 최고 관리자</Link><div><h1 className="text-3xl font-bold">수정 이력 · 복구</h1><p className="mt-3 text-sm text-[#9296A5]">프로필·링크·테마·템플릿 선택만 복구합니다. 방문 통계와 관리자 권한은 복구하지 않습니다.</p></div><div className="flex gap-2 flex-wrap">{sites?.map(s=><Link key={s.id} href={`/admin/history?site=${s.id}`} className={`rounded-full px-4 py-2 text-sm ${chosen?.id===s.id?"bg-[#282C41] text-white":"border bg-white"}`}>{s.name}</Link>)}</div>{chosen?<HistoryViewer history={history||[]} siteName={chosen.name}/>:<p>고객 사이트가 없습니다.</p>}</main>;
}
