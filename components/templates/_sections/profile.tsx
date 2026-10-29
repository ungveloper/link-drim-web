import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Content } from "@/lib/templates";
import { SocialContacts } from "../_components/social-contacts";
import { LinkCollection } from "../_components/link-collection";
export function ProfileSection({content,siteId,preview}:{content:Content;siteId?:string;preview:boolean}){
 return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-10 sm:py-20"><div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16"><div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[30px] bg-[#F3F3F5]">{content.imageUrl?<Image unoptimized width={800} height={1000} className="size-full object-cover" src={content.imageUrl} alt={content.name}/>:<UserRound className="size-20 opacity-35"/>}</div>
 <div><span className="text-sm font-semibold tracking-[0.16em] opacity-65">ABOUT ME</span><h1 className="mt-6 break-keep text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">{content.name||"이름을 입력하세요"}</h1><h2 className="mt-5 text-xl font-semibold text-[var(--brand-secondary)] sm:text-2xl">{content.headline}</h2><p className="mt-7 whitespace-pre-wrap break-keep text-base leading-8 text-[var(--brand-secondary)]">{content.bio}</p>{content.organization&&<span className="mt-8 inline-block rounded-full border border-current/15 px-4 py-2 text-sm">{content.organization}</span>}<div className="mt-5"><SocialContacts content={content} siteId={siteId} template="profile" preview={preview}/></div></div></div><div className="mt-16 border-t border-current/15 pt-8"><h3 className="text-lg font-bold">더 알아보기</h3><LinkCollection content={content} siteId={siteId} template="profile" preview={preview} display="list"/></div></div>;
}
