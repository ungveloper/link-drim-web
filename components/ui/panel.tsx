import type { ReactNode } from "react";

export function Panel({ title, description, children, action }: {title?:string;description?:string;children:ReactNode;action?:ReactNode}) {
  return <section className="rounded-[22px] border border-[#E8EAF0] bg-white p-5 shadow-[0_6px_30px_rgba(27,35,62,0.035)] sm:p-7">
    {(title || description) && <div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold tracking-tight text-[#252837]">{title}</h2>{description && <p className="mt-1 text-sm leading-6 text-[#858C99]">{description}</p>}</div>{action}</div>}
    {children}
  </section>;
}
export function Field({ label, children, hint, required }: {label:string;children:ReactNode;hint?:string;required?:boolean}) {
  return <label className="block space-y-2"><span className="block text-sm font-semibold text-[#3F4554]">{label}{required && <span className="ml-1 text-[#E25F66]">*</span>}</span>{children}{hint && <span className="block text-xs text-[#9299A5]">{hint}</span>}</label>;
}
export const inputClass = "w-full min-h-11 rounded-xl border border-[#DDE1E9] bg-white px-3.5 py-2.5 text-sm text-[#252837] outline-none transition placeholder:text-[#A3AAB6] focus:border-[#806CE2] focus:ring-2 focus:ring-[#806CE2]/10 disabled:bg-[#F3F4F7]";
export const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#292E43] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4B5271] disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DFE2E9] bg-white px-4 py-2.5 text-sm font-semibold text-[#505767] hover:bg-[#F5F6FA]";
