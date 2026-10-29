import { ArrowUpRight } from "lucide-react";
import { orderedLinks, type Content, type TemplateKey } from "@/lib/templates";
import { TrackLink } from "../tracking";
export function LinkCollection({content,siteId,template,preview,display}:{content:Content;siteId?:string;template:TemplateKey;preview:boolean;display:Content["linkDisplay"]}){
 const links=orderedLinks(content);
 return <div className={display==="card"?"mt-7 grid grid-cols-2 gap-3":"mt-7 space-y-3"}>{links.map(l=><TrackLink key={l.id} siteId={siteId} template={template} eventType="link" title={l.title} href={l.url} disabled={preview} className={display==="card"?"flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-current/15 bg-black/[0.03] px-3 text-center text-sm font-semibold transition hover:-translate-y-0.5":"flex min-h-14 items-center justify-between rounded-2xl bg-[var(--brand-primary)] px-5 text-left text-sm font-semibold text-white transition hover:opacity-85"}>{l.title}<ArrowUpRight size={17}/></TrackLink>)}</div>;
}
