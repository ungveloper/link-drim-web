import Link from "next/link";
import { Layers3 } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 font-bold tracking-[-0.045em] text-[#252837]">
      <span className="flex size-9 items-center justify-center rounded-xl bg-[#222638] text-white"><Layers3 size={20} /></span>
      {!compact && <span className="text-xl">LinkDrim<span className="text-[#7C6BDB]">.</span></span>}
    </Link>
  );
}
