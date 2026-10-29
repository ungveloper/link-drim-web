import { notFound } from "next/navigation";
import { authorizedSites,requireUser } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { defaultContent,templateCatalog,type Content,type TemplateSelection } from "@/lib/templates";
export async function loadDashboard(siteId?:string){
 const user=await requireUser();const sites=await authorizedSites(user.id);
 if(!sites.length)return {sites:[],selected:null,templates:[] as TemplateSelection[]};
 const selected=sites.find(s=>s.id===siteId)||sites[0];if(!selected)notFound();
 const {data,error}=await getAdminClient().from("site_templates").select("template_key,enabled,version").eq("site_id",selected.id);
 if(error)throw error;
 const templates=templateCatalog.map(t=>({key:t.key,enabled:Boolean(data?.find(x=>x.template_key===t.key)?.enabled),version:data?.find(x=>x.template_key===t.key)?.version||t.version}));
 return {sites,selected:{...selected,content:{...defaultContent,...(selected.content as Partial<Content>||{}),theme:{...defaultContent.theme,...((selected.content as Partial<Content>)?.theme||{})}} as Content},templates};
}
