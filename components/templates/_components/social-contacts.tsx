import { AtSign, Instagram, Mail, Phone, Youtube } from "lucide-react";
import type { Content, TemplateKey } from "@/lib/templates";
import { TrackLink } from "../tracking";
export function SocialContacts({content,siteId,template,preview}:{content:Content;siteId?:string;template:TemplateKey;preview:boolean}){
 const items=[{label:"전화",url:content.phone?`tel:${content.phone.replace(/[^0-9+]/g,"")}`:"",Icon:Phone,type:"phone"},{label:"이메일",url:content.email?`mailto:${content.email}`:"",Icon:Mail,type:"email"},{label:"인스타그램",url:content.instagram,Icon:Instagram,type:"social"},{label:"쓰레드",url:content.threads,Icon:AtSign,type:"social"},{label:"유튜브",url:content.youtube,Icon:Youtube,type:"social"}].filter(x=>x.url);
 return <div className="flex flex-wrap gap-2">{items.map(x=><TrackLink key={x.label} siteId={siteId} template={template} eventType={x.type} title={x.label} href={x.url} disabled={preview} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm font-semibold transition hover:bg-black/5"><x.Icon size={17}/>{x.label}</TrackLink>)}</div>;
}
