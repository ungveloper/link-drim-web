import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Content } from "@/lib/templates";
import { SocialContacts } from "../_components/social-contacts";
import { LinkCollection } from "../_components/link-collection";
export function MultiLinkSection({content,siteId,preview}:{content:Content;siteId?:string;preview:boolean}){
 return <div className="mx-auto max-w-xl px-5 py-14 text-center sm:py-20"><div className="mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full bg-[#EEEFF3]">{content.imageUrl?<Image unoptimized width={192} height={192} className="size-full object-cover" src={content.imageUrl} alt={content.name}/>:<UserRound size={42} className="opacity-40"/>}</div><h1 className="mt-5 text-2xl font-extrabold tracking-tight">{content.name||"이름을 입력하세요"}</h1><p className="mt-2 whitespace-pre-wrap break-keep text-sm leading-6 text-[var(--brand-secondary)]">{content.headline}</p><div className="mt-8"><SocialContacts content={content} siteId={siteId} template="link" preview={preview}/></div><LinkCollection content={content} siteId={siteId} template="link" preview={preview} display={content.linkDisplay}/><p className="mt-12 text-xs text-[var(--brand-secondary)]">Created with LinkDrim</p></div>;
}
