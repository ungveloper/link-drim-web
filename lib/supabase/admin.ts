import "server-only";
import { createClient } from "@supabase/supabase-js";
export function getAdminClient(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url || !key)throw new Error("Supabase 서버 인증정보가 없습니다.");
 return createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
}
