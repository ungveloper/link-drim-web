import "server-only";
import { createHash } from "node:crypto";
import { getAdminClient } from "@/lib/supabase/admin";
export async function logIssue(siteId:string|null,category:string,message:string){
  try{const admin=getAdminClient();const fingerprint=createHash("sha256").update([siteId,category,message].join("|")).digest("hex");
    const {data}=await admin.from("site_issues").select("occurrence_count").eq("fingerprint",fingerprint).maybeSingle();
    await admin.from("site_issues").upsert({fingerprint,site_id:siteId,category,message,occurrence_count:Number(data?.occurrence_count||0)+1,last_seen_at:new Date().toISOString()},{onConflict:"fingerprint"});
  }catch{/* Keep failures from affecting site operations. */}
}
