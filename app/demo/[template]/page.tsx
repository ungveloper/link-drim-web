import { notFound } from "next/navigation";
import { demoContent, templateCatalog, type TemplateKey } from "@/lib/templates";
import { TemplateView } from "@/components/templates/template-view";
export default async function DemoPage({params}:{params:Promise<{template:string}>}){
  const {template}=await params;
  if(!templateCatalog.some(t=>t.key===template))notFound();
  return <TemplateView kind={template as TemplateKey} content={demoContent} preview/>;
}
