import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
export async function requireUser(){
 const supabase=await getServerClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");return user;
}
export async function isSuperAdmin(id:string):Promise<boolean>{
 const {data}=await getAdminClient().from("app_users").select("role").eq("id",id).maybeSingle();return data?.role==="super_admin";
}
export async function requireAdmin(){const u=await requireUser();if(!await isSuperAdmin(u.id))redirect("/dashboard");return u;}
export async function authorizedSites(userId:string){
 const admin=getAdminClient();if(await isSuperAdmin(userId)){
  const {data,error}=await admin.from("sites").select("id,slug,name,content,revision,home_template,settings,status").order("created_at",{ascending:false});if(error)throw error;return data||[];
 }
 const {data,error}=await admin.from("site_members").select("site:sites(id,slug,name,content,revision,home_template,settings,status)").eq("user_id",userId);if(error)throw error;
 return (data||[]).flatMap(x=>x.site?[x.site]:[]).flat() as unknown as SiteRow[];
}
export type SiteRow={id:string;slug:string;name:string;content:unknown;revision:number;home_template:string|null;settings:unknown;status:string};
