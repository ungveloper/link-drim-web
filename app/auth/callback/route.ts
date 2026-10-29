import { NextResponse, type NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
export async function GET(request:NextRequest){
 const url=new URL(request.url),code=url.searchParams.get("code"),next=url.searchParams.get("next")||"/dashboard";
 // Refuse open redirects and protocol-relative paths.
 const destination=next==="/dashboard" || /^\/invite\/[A-Za-z0-9_-]{20,100}$/.test(next) ? next : "/dashboard";
 if(code){const supabase=await getServerClient();const {error}=await supabase.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(destination,url.origin));}
 return NextResponse.redirect(new URL("/login?error=oauth",url.origin));
}
