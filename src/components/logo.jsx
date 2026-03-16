import Image from "next/image";
import { cn } from "@/lib/utils";
const markSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-12 h-12",
};
const markPx = {
    sm: 32,
    md: 36,
    lg: 48,
};
const wordSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
};
/** AlphaNex mark: folded-ribbon A from brand artwork. */
export function AlphaNexMark({ className, title = "AlphaNex", size = 36, }) {
    return (<Image src="/logo.png" alt={title} width={size} height={size} className={cn("shrink-0 object-contain", className)} priority/>);
}
export function Logo({ className, markClassName, showWordmark = true, size = "md", }) {
    return (<span className={cn("inline-flex items-center gap-3", className)}>
      <AlphaNexMark size={markPx[size]} className={cn(markSizes[size], "transition-opacity duration-300 group-hover:opacity-90", markClassName)}/>
      {showWordmark ? (<span className="flex flex-col leading-none">
          <span className={cn("font-brand font-bold text-slate-50 tracking-[0.08em] group-hover:text-amber-300 transition-colors", wordSizes[size])}>
            AlphaNex
          </span>
          <span className="mt-1 hidden sm:block font-brand text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400 group-hover:text-amber-400/90 transition-colors">
            Exchange
          </span>
        </span>) : null}
    </span>);
}
