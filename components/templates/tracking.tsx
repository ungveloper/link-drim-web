"use client";
import { useEffect, type ReactNode } from "react";
import type { TemplateKey } from "@/lib/templates";
function getSessionId():string { const key="linkdrim_session"; let id=sessionStorage.getItem(key); if(!id){id=crypto.randomUUID();sessionStorage.setItem(key,id)}return id; }
function send(siteId:string,template:string,type:string,target=""){
  try {const url=new URL(location.href);const body=JSON.stringify({siteId,template,type,target,sessionId:getSessionId(),referrer:document.referrer.slice(0,500),utmSource:url.searchParams.get("utm_source")?.slice(0,70)||null});
    if(navigator.sendBeacon){navigator.sendBeacon("/api/track",new Blob([body],{type:"application/json"}));}else{void fetch("/api/track",{method:"POST",headers:{"Content-Type":"application/json"},body,keepalive:true});}
  }catch{/* Analysis failure must never block public pages. */}
}
export function PageTracker({siteId,template}:{siteId:string;template:TemplateKey}) {useEffect(()=>{send(siteId,template,"view");const start=Date.now();const trackExit=()=>send(siteId,template,"duration",String(Math.min(600,Math.round((Date.now()-start)/1000))));document.addEventListener("visibilitychange",onVisibility);function onVisibility(){if(document.visibilityState==="hidden")trackExit()}return()=>document.removeEventListener("visibilitychange",onVisibility)},[siteId,template]);return null;}
export function TrackLink({href,siteId,template,title,eventType,disabled,className,children}:{href:string;siteId?:string;template:TemplateKey;title:string;eventType:string;disabled:boolean;className:string;children:ReactNode}){
  return <a href={disabled?undefined:href} aria-disabled={disabled} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noopener noreferrer":undefined} className={className} onClick={disabled?(e)=>e.preventDefault():()=>siteId&&send(siteId,template,eventType,title)}>{children}</a>;
}
