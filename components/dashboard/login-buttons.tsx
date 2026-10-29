"use client";
import { useState } from "react";
import { toast } from "sonner";
import { getBrowserClient } from "@/lib/supabase/browser";
const options=[{name:"Google로 계속하기",provider:"google",cls:"bg-white border border-[#E2E4EA] text-[#262935]"},{name:"카카오로 계속하기",provider:"kakao",cls:"bg-[#FEE500] text-[#342E00]"},{name:"네이버로 계속하기",provider:"custom:naver",cls:"bg-[#03C75A] text-white"}] as const;
export function LoginButtons(){
 const [loading,setLoading]=useState("");
 async function signIn(provider:string){try{setLoading(provider);const next=new URLSearchParams(location.search).get("next")||"/dashboard";const {error}=await getBrowserClient().auth.signInWithOAuth({provider:provider as "google",options:{redirectTo:`${location.origin}/auth/callback?next=${encodeURIComponent(next)}`}});if(error)throw error;}catch(e){toast.error(e instanceof Error?e.message:"로그인 연결에 실패했습니다.");setLoading("")}}
 return <div className="mt-8 space-y-3">{options.map(x=><button key={x.provider} type="button" disabled={Boolean(loading)} onClick={()=>signIn(x.provider)} className={`min-h-12 w-full rounded-xl px-4 text-sm font-bold transition hover:brightness-95 disabled:opacity-60 ${x.cls}`}>{loading===x.provider?"로그인 연결 중...":x.name}</button>)}</div>;
}
