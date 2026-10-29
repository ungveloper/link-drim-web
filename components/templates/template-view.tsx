import type { Content, TemplateKey } from "@/lib/templates";
import { PageTracker } from "./tracking";
import { ProfileSection } from "./_sections/profile";
import { BusinessCardSection } from "./_sections/business-card";
import { MultiLinkSection } from "./_sections/multi-link";
export function TemplateView({kind,content,siteId,preview=false}:{kind:TemplateKey;content:Content;siteId?:string;preview?:boolean}){
 const themeVars={"--brand-primary":content.theme.primary,"--brand-secondary":content.theme.secondary,"--brand-background":content.theme.background} as React.CSSProperties;
 return <main className="min-h-[100dvh] bg-[var(--brand-background)] text-[var(--brand-primary)]" style={themeVars}>
  {!preview&&siteId&&<PageTracker siteId={siteId} template={kind}/>}
  {kind==="profile"?<ProfileSection content={content} siteId={siteId} preview={preview}/>:kind==="business-card"?<BusinessCardSection content={content} siteId={siteId} preview={preview}/>:<MultiLinkSection content={content} siteId={siteId} preview={preview}/>} 
 </main>;
}
