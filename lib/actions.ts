"use server";
import { createHash, randomBytes } from "node:crypto";
import { logIssue } from "@/lib/issues";
import { revalidatePath } from "next/cache";
import { getServerClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requireUser, isSuperAdmin } from "@/lib/auth";
import { checkRequired, type Content } from "@/lib/templates";
import { saveSchema, createSiteSchema } from "@/lib/schemas";

export type ActionResult={ok:boolean;message:string;revision?:number;token?:string};
export async function saveSiteAction(input:unknown):Promise<ActionResult>{
 const user=await requireUser();const parsed=saveSchema.safeParse(input);
 if(!parsed.success)return{ok:false,message:"입력 정보가 올바르지 않습니다. 필수 항목을 다시 확인해 주세요."};
 const x=parsed.data;
 if(!await isSuperAdmin(user.id)){const {data:membership}=await getAdminClient().from("site_members").select("site_id").eq("site_id",x.siteId).eq("user_id",user.id).maybeSingle();if(!membership)return {ok:false,message:"해당 사이트의 편집 권한이 없습니다."};}
 const required=checkRequired(x.content as Content,x.templates);
 if(required){await logIssue(x.siteId,"validation",`Required field: ${required}`);return {ok:false,message:`필수 항목(${required})을 입력해 주세요.`};}
 const db=await getServerClient();
 const {data,error}=await db.rpc("save_site",{p_site_id:x.siteId,p_revision:x.revision,p_slug:x.slug,p_content:x.content,p_templates:x.templates,p_home:x.homeTemplate});
 if(error){const msg=error.message.includes("STALE_REVISION")?"다른 관리자가 먼저 수정했습니다. 새로고침 후 확인해 주세요.":error.message.includes("duplicate key")?"이미 사용 중인 주소입니다.":"저장에 실패했습니다. 잠시 후 다시 시도해 주세요.";await logIssue(x.siteId,"save",error.message.slice(0,300));return {ok:false,message:msg};}
 revalidatePath("/dashboard");revalidatePath("/dashboard/manage");revalidatePath(`/${x.slug}`);
 return {ok:true,message:"변경사항이 공개 페이지에 반영되었습니다.",revision:Number(data)};
}
export async function checkSlugAction(slug:string,siteId:string):Promise<boolean>{
 await requireUser();const {isValidSlug}=await import("@/lib/templates");if(!isValidSlug(slug))return false;
 const {data}=await getAdminClient().from("sites").select("id").eq("slug",slug).neq("id",siteId).maybeSingle();return !data;
}
export async function createSiteAction(input:unknown):Promise<ActionResult>{
 await requireAdmin();const parsed=createSiteSchema.safeParse(input);if(!parsed.success)return{ok:false,message:"고객명 또는 URL을 확인해 주세요."};
 const {defaultContent}=await import("@/lib/templates");const x=parsed.data;
 const {data,error}=await getAdminClient().from("sites").insert({name:x.name,slug:x.slug,content:defaultContent,published_content:defaultContent,status:x.isPublished?"published":"draft"}).select("id").single();
 if(error)return{ok:false,message:error.code==="23505"?"이미 사용 중인 URL입니다.":error.message};
 await getAdminClient().from("site_templates").insert(["profile","business-card","link"].map(key=>({site_id:data.id,template_key:key,enabled:false,version:"1.0.0"})));
 revalidatePath("/admin");return{ok:true,message:"고객 사이트가 생성되었습니다."};
}
export async function createInviteAction(siteId:string):Promise<ActionResult>{
 await requireAdmin();const token=randomBytes(32).toString("base64url"),digest=createHash("sha256").update(token).digest("hex");
 const {error}=await getAdminClient().from("site_invites").insert({site_id:siteId,token_sha256:digest,expires_at:new Date(Date.now()+7*86400000).toISOString()});
 if(error)return{ok:false,message:error.message};return{ok:true,message:"7일간 유효한 일회용 링크가 발급되었습니다.",token};
}
export async function redeemInviteAction(token:string):Promise<ActionResult>{
 const user=await requireUser();if(!token || token.length>100)return{ok:false,message:"잘못된 초대 링크입니다."};
 const digest=createHash("sha256").update(token).digest("hex");const {error}=await (await getServerClient()).rpc("accept_site_invite",{p_hash:digest});
 if(error){await logIssue(null,"invite",error.message);return{ok:false,message:"초대가 만료되었거나 이미 사용되었습니다. 관리자에게 새 링크를 요청해 주세요."};}
 revalidatePath("/dashboard");return{ok:true,message:`${user.email||"로그인 계정"}으로 사이트가 연결되었습니다.`};
}
export async function revokeMemberAction(siteId:string,userId:string):Promise<ActionResult>{
 await requireAdmin();const db=getAdminClient();const {error}=await db.from("site_members").delete().eq("site_id",siteId).eq("user_id",userId);
 if(error)return{ok:false,message:error.message};revalidatePath("/admin");return{ok:true,message:"해당 계정의 접근 권한이 해제되었습니다."};
}
export async function signOutAction(){const supabase=await getServerClient();await supabase.auth.signOut();const {redirect}=await import("next/navigation");redirect("/");}
export async function restoreSiteAction(siteId:string,revision:number,reset:boolean):Promise<ActionResult>{
 await requireAdmin();
 const db=await getServerClient();
 const {data,error}=await db.rpc("restore_site",{p_site_id:siteId,p_revision:revision,p_reset:reset});
 if(error)return{ok:false,message:error.message};
 revalidatePath("/admin/history");revalidatePath("/dashboard");return{ok:true,message:reset?"고객 데이터가 초기화되었습니다. 복구 이력은 보존됩니다.":"선택한 버전의 콘텐츠가 복구되었습니다.",revision:Number(data)};
}

export async function revokeAllMembersAction(siteId:string):Promise<ActionResult>{
 await requireAdmin();const db=getAdminClient();
 const {error}=await db.from("site_members").delete().eq("site_id",siteId);
 if(error)return{ok:false,message:error.message};
 await db.from("site_invites").delete().eq("site_id",siteId).is("consumed_at",null);
 revalidatePath("/admin");return{ok:true,message:"모든 연결 계정과 미사용 초대 권한을 해제했습니다."};
}
