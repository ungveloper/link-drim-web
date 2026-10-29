import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { templateCatalog } from "@/lib/templates";
const eventSchema=z.object({siteId:z.uuid(),template:z.enum(["profile","business-card","link"]),type:z.enum(["view","link","social","phone","email","duration"]),target:z.string().max(140),sessionId:z.uuid(),referrer:z.string().max(500),utmSource:z.string().max(70).nullable()});
export async function POST(request:NextRequest){
 try{
  if(Number(request.headers.get("content-length")||0)>4096)return new NextResponse(null,{status:413});
  const parsed=eventSchema.safeParse(await request.json());if(!parsed.success)return new NextResponse(null,{status:400});
  const e=parsed.data;if(!templateCatalog.some(t=>t.key===e.template))return new NextResponse(null,{status:400});
  const admin=getAdminClient();const {data}=await admin.from("sites").select("id,status").eq("id",e.siteId).eq("status","published").maybeSingle();
  if(!data)return new NextResponse(null,{status:404});
  let referrerHost="";try{referrerHost=e.referrer?new URL(e.referrer).hostname.slice(0,150):""}catch{}
  await admin.from("visit_events").insert({site_id:e.siteId,template_key:e.template,kind:e.type,target:e.target,session_id:e.sessionId,source:e.utmSource||referrerHost||null,referrer_host:referrerHost||null});
  return new NextResponse(null,{status:204});
 }catch{return new NextResponse(null,{status:204})}
}
