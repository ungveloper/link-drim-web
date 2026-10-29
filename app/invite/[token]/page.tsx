import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { redeemInviteAction } from "@/lib/actions";
import { Brand } from "@/components/ui/brand";
import { primaryButton } from "@/components/ui/panel";
export default async function InvitePage({params}:{params:Promise<{token:string}>}){
 const {token}=await params;const {data:{user}}=await (await getServerClient()).auth.getUser();if(!user)redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
 async function accept(){"use server";const res=await redeemInviteAction(token);if(res.ok){const {redirect}=await import("next/navigation");redirect("/dashboard/manage")}const {redirect}=await import("next/navigation");redirect(`/login?error=invite`);}
 return <main className="flex min-h-screen items-center justify-center px-5"><div className="w-full max-w-md rounded-2xl border bg-white p-8"><Brand/><h1 className="mt-8 text-2xl font-bold">사이트 관리자로 연결하기</h1><p className="mt-3 text-sm leading-7 text-[#8E93A2]">이 초대 링크는 한 번만 사용할 수 있습니다. 본인의 소셜 로그인 계정으로 접속했는지 확인한 후 연결하세요.</p><form className="mt-8" action={accept}><button className={`${primaryButton} w-full`}>내 계정에 연결하기</button></form><Link href="/dashboard" className="mt-5 block text-center text-sm text-[#8674CF]">나중에 연결</Link></div></main>;
}
