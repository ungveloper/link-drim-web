import { Panel } from "@/components/ui/panel";
import { DashboardShell } from "@/components/dashboard/shell";
import { Editor } from "@/components/dashboard/editor";
import { loadDashboard } from "@/lib/dashboard";
export default async function ManagePage({searchParams}:{searchParams:Promise<{site?:string}>}){
 const {site}=await searchParams;const {sites,selected,templates}=await loadDashboard(site);
 if(!selected)return <div className="p-10 text-center">관리할 사이트가 없습니다. 최고 관리자에게 초대를 요청하세요.</div>;
 return <DashboardShell sites={sites} selectedId={selected.id}><div><p className="text-sm font-semibold text-[#8176CA]">MY PAGE</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">페이지 관리</h1><p className="mt-2 text-sm text-[#858A98]">템플릿을 선택하고 필요한 정보만 입력하세요. 저장하면 공개 페이지에 반영됩니다.</p></div><Panel><Editor site={selected} templates={templates}/></Panel></DashboardShell>;
}
