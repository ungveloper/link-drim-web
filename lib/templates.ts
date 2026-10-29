export type TemplateKey = "profile" | "business-card" | "link";
export type LinkItem = { id: string; title: string; url: string; visible: boolean; pinned: boolean };
export type Content = {
  name: string; headline: string; bio: string; imageUrl: string; backgroundUrl: string;
  phone: string; email: string; organization: string; instagram: string; threads: string; youtube: string;
  theme: { primary: string; secondary: string; background: string };
  linkDisplay: "list" | "card"; links: LinkItem[];
};
export type TemplateSelection = {key:TemplateKey;enabled:boolean;version:string};
export const templateCatalog = [
  { key:"profile", route:"profile", label:"프로필", title:"프로필 페이지", description:"소개·경력·스토리를 정갈하게 전달", version:"1.0.0", required:["name","headline","bio"] },
  { key:"business-card", route:"business-card", label:"디지털 명함", title:"디지털 명함", description:"연락처와 소개를 한 장에", version:"1.0.0", required:["name","headline"] },
  { key:"link", route:"link", label:"멀티링크", title:"멀티링크", description:"여러 채널을 깔끔하게 한곳에", version:"1.0.0", required:["name"] },
] as const;
export const defaultContent: Content = {
  name:"", headline:"", bio:"", imageUrl:"", backgroundUrl:"", phone:"", email:"", organization:"", instagram:"", threads:"", youtube:"",
  theme:{primary:"#222222",secondary:"#767676",background:"#FFFFFF"},linkDisplay:"list",links:[],
};
export const demoContent: Content = {
  ...defaultContent, name:"김도현",headline:"일상에서 신뢰를 만드는 전문가",bio:"반갑습니다. 제가 걸어온 길과 소중하게 생각하는 가치를 이곳에서 소개합니다. 다양한 채널을 통해 편하게 소통해 주세요.",organization:"홀로기업 스튜디오",phone:"010-0000-0000",email:"hello@example.com",instagram:"https://instagram.com",threads:"https://threads.net",links:[
    {id:"a",title:"나의 이야기",url:"https://example.com",visible:true,pinned:true},
    {id:"b",title:"인스타그램",url:"https://instagram.com",visible:true,pinned:false},
    {id:"c",title:"문의하기",url:"mailto:hello@example.com",visible:true,pinned:false},
  ]
};
export function activeTemplateKeys(keys: TemplateSelection[]):TemplateKey[] {return keys.filter(x=>x.enabled).map(x=>x.key);}
export function checkRequired(content:Content, selected:TemplateSelection[]):string | null {
  const active=activeTemplateKeys(selected);
  if (active.length===0) return null;
  for(const field of new Set(active.flatMap(key=>templateCatalog.find(t=>t.key===key)?.required||[]))) {
    if(!String(content[field as keyof Pick<Content,"name"|"headline"|"bio">]||"").trim()) return field;
  }
  if(active.includes("business-card") && !content.phone.trim() && !content.email.trim()) return "phone";
  if(active.includes("link") && !content.links.some(x=>x.visible && x.title.trim() && isSafeHref(x.url))) return "links";
  return null;
}
export function isSafeHref(url:string):boolean {
  try { const p=new URL(url);return ["https:","http:","mailto:","tel:"].includes(p.protocol); } catch { return false; }
}
export function orderedLinks(content: Content):LinkItem[] {
  return content.links.filter(l=>l.visible && l.title && isSafeHref(l.url)).sort((a,b)=>Number(b.pinned)-Number(a.pinned));
}
export const validSlug=/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;
export const reservedSlugs=new Set(["admin","dashboard","login","api","auth","invite","about","demo","_next","favicon.ico"]);
export function isValidSlug(slug:string):boolean {return validSlug.test(slug) && !reservedSlugs.has(slug);}
