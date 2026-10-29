"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowDownUp, RotateCcw, Trash2 } from "lucide-react";
import { restoreSiteAction } from "@/lib/actions";
import { secondaryButton } from "@/components/ui/panel";
type History={id:number;site_id:string;revision:number;operation:string;actor_id:string|null;snapshot:unknown;created_at:string};
export function HistoryViewer({history,siteName}:{history:History[];siteName:string}){
 const [active,setActive]=useState<number|null>(null),[pending,start]=useTransition();
 const current=history.find(h=>h.revision===active),previous=history.find(h=>h.revision===(active||0)-1);
 function restore(reset:boolean){if(!history.length)return;const revision=current?.revision||history[0].revision;
  if(reset){const typed=prompt(`사이트 전체 콘텐츠를 초기화하려면 '${siteName}'을 입력하세요.`);if(typed!==siteName){toast.error("사이트 이름이 일치하지 않아 초기화를 취소했습니다.");return;}}
  else if(!confirm(`버전 ${revision}의 콘텐츠로 복구할까요? 현재 수정 내용은 새로운 이력으로 보존됩니다.`))return;
  start(async()=>{const r=await restoreSiteAction(history[0].site_id,revision,reset);if(r.ok){toast.success(r.message);}else{toast.error(r.message);}if(r.ok)location.reload()});
 }
 return <div className="space-y-4"><div className="flex flex-wrap gap-2"><button disabled={!current||pending} className={secondaryButton} onClick={()=>restore(false)}><RotateCcw size={15}/> 선택 버전 복구</button><button disabled={!history.length||pending} className={`${secondaryButton} text-[#CF575B]`} onClick={()=>restore(true)}><Trash2 size={15}/> 전체 콘텐츠 초기화</button></div>
  <div className="grid gap-4 lg:grid-cols-[260px_1fr]"><div className="max-h-[500px] space-y-2 overflow-y-auto">{history.map(h=><button key={h.id} className={`w-full rounded-xl border p-3 text-left text-xs ${active===h.revision?"border-[#9280D7] bg-[#F4F1FF]":"border-[#E7E9EF] bg-white"}`} onClick={()=>setActive(h.revision)}><span className="font-bold">v{h.revision} · {h.operation}</span><span className="mt-1 block text-[#9298A5]">{new Date(h.created_at).toLocaleString("ko-KR")}</span></button>)}</div><div className="min-w-0 rounded-xl border border-[#E8EAF0] bg-[#FAFAFC] p-4"><h3 className="flex items-center gap-2 text-sm font-bold"><ArrowDownUp size={16}/> 버전 내용 비교</h3>{current?<div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="mb-2 text-xs font-bold text-[#9A7070]">이전 버전</p><pre className="max-h-96 overflow-auto rounded-lg bg-[#FFF4F4] p-3 text-xs whitespace-pre-wrap break-all">{JSON.stringify(previous?.snapshot??{},null,2)}</pre></div><div><p className="mb-2 text-xs font-bold text-[#57826B]">선택 버전</p><pre className="max-h-96 overflow-auto rounded-lg bg-[#EFFBF2] p-3 text-xs whitespace-pre-wrap break-all">{JSON.stringify(current.snapshot,null,2)}</pre></div></div>:<p className="mt-5 text-sm text-[#969BA8]">왼쪽에서 버전을 선택하면 변경 데이터를 비교할 수 있습니다.</p>}</div></div>
 </div>;
}
