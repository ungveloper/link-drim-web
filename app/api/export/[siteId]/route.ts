import { NextResponse } from "next/server";
import { requireUser, authorizedSites } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
export async function GET(_request:Request,{params}:{params:Promise<{siteId:string}>}){
 const user=await requireUser();const {siteId}=await params;
 const sites=await authorizedSites(user.id);if(!sites.some(x=>x.id===siteId))return new NextResponse(null,{status:403});
 const admin=getAdminClient();const {data:site}=await admin.from("sites").select("name,slug,content,home_template,updated_at").eq("id",siteId).single();
 if(!site)return new NextResponse(null,{status:404});
 const {data:templates}=await admin.from("site_templates").select("template_key,version,enabled").eq("site_id",siteId);
 const payload=JSON.stringify({site,templates:templates||[]},null,2);
 return new NextResponse(payload,{headers:{"Content-Type":"application/json; charset=utf-8","Content-Disposition":`attachment; filename="linkdrim-export.json"`,"Cache-Control":"private,no-store"}});
}
