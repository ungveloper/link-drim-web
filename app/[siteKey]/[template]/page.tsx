import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateView } from "@/components/templates/template-view";
import { getAdminClient } from "@/lib/supabase/admin";
import { contentSchema } from "@/lib/schemas";
import { templateCatalog,type TemplateKey } from "@/lib/templates";

async function lookup(slug:string,template:string){
 if(!templateCatalog.some(t=>t.key===template))return null;
 if(!process.env.SUPABASE_SERVICE_ROLE_KEY)return null;
 const admin=getAdminClient();const {data:site}=await admin.from("sites").select("id,name,slug,status,settings,published_content").eq("slug",slug).eq("status","published").maybeSingle();
 if(!site)return null;
 const {data:active}=await admin.from("site_templates").select("version").eq("site_id",site.id).eq("template_key",template).eq("enabled",true).maybeSingle();
 if(!active)return null;
 const content=contentSchema.safeParse(site.published_content);if(!content.success)return null;
 return {site,content:content.data};
}
export async function generateMetadata({params}:{params:Promise<{siteKey:string;template:string}>}):Promise<Metadata>{
 const p=await params;const found=await lookup(p.siteKey,p.template);if(!found)return{title:"페이지를 찾을 수 없습니다",robots:{index:false,follow:false}};
 const {site,content}=found;const url=process.env.NEXT_PUBLIC_APP_URL||"https://linkdrim.com";
 return {title:`${content.name} | ${site.name}`,description:content.headline||content.bio.slice(0,150),robots:{index:(site.settings as {seoIndex?:boolean})?.seoIndex!==false},alternates:{canonical:`${url}/${site.slug}/${p.template}`},openGraph:{title:content.name,description:content.headline,images:content.imageUrl?[content.imageUrl]:undefined}};
}
export default async function PublicPage({params}:{params:Promise<{siteKey:string;template:string}>}){
 const {siteKey,template}=await params;const found=await lookup(siteKey,template);if(!found)notFound();
 return <TemplateView kind={template as TemplateKey} content={found.content} siteId={found.site.id}/>;
}
