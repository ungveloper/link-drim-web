import { notFound, redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
export default async function SiteHome({params}:{params:Promise<{siteKey:string}>}){
 const {siteKey}=await params;if(!process.env.SUPABASE_SERVICE_ROLE_KEY)notFound();
 const {data:site}=await getAdminClient().from("sites").select("home_template,status").eq("slug",siteKey).maybeSingle();
 if(!site||site.status!=="published")notFound();
 if(!site.home_template)return <main className="flex min-h-[100dvh] items-center justify-center px-5 text-center"><div><p className="text-3xl font-bold">페이지를 준비 중입니다.</p><p className="mt-4 text-sm text-gray-500">곧 새로운 모습으로 찾아뵙겠습니다.</p></div></main>;
 redirect(`/${siteKey}/${site.home_template}`);
}
