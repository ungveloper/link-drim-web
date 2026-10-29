import QRCode from "qrcode";
import { getAdminClient } from "@/lib/supabase/admin";
export async function GET(_req:Request,{params}:{params:Promise<{siteId:string}>}){
 const {siteId}=await params;if(!/^[a-f0-9-]{36}$/.test(siteId))return new Response(null,{status:404});
 const {data:site}=await getAdminClient().from("sites").select("slug,status").eq("id",siteId).eq("status","published").maybeSingle();if(!site)return new Response(null,{status:404});
 const base=process.env.NEXT_PUBLIC_APP_URL||"https://linkdrim.com";
 const png=await QRCode.toBuffer(`${base}/${site.slug}/business-card`,{width:256,margin:2,errorCorrectionLevel:"M"});
 return new Response(new Uint8Array(png),{headers:{"Content-Type":"image/png","Cache-Control":"public, max-age=300"}});
}
