import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { contentSchema } from "@/lib/schemas";
function safe(s:string){return s.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/[,;]/g,"\\$&");}
export async function GET(_req:Request,{params}:{params:Promise<{siteId:string}>}){
 const {siteId}=await params;if(!/^[a-f0-9-]{36}$/.test(siteId))return new NextResponse(null,{status:404});
 const admin=getAdminClient();const {data:site}=await admin.from("sites").select("status,published_content").eq("id",siteId).eq("status","published").maybeSingle();if(!site)return new NextResponse(null,{status:404});
 const {data:t}=await admin.from("site_templates").select("template_key").eq("site_id",siteId).eq("template_key","business-card").eq("enabled",true).maybeSingle();if(!t)return new NextResponse(null,{status:404});
 const parsed=contentSchema.safeParse(site.published_content);if(!parsed.success)return new NextResponse(null,{status:404});const c=parsed.data;
 const lines=["BEGIN:VCARD","VERSION:3.0",`FN:${safe(c.name)}`,`ORG:${safe(c.organization)}`,`TITLE:${safe(c.headline)}`,c.phone?`TEL:${safe(c.phone)}`:"",c.email?`EMAIL:${safe(c.email)}`:"","END:VCARD"].filter(Boolean).join("\r\n");
 return new NextResponse(lines,{headers:{"Content-Type":"text/vcard; charset=utf-8","Content-Disposition":"attachment; filename=contact.vcf","Cache-Control":"no-store"}});
}
