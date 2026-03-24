"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-electric-500 focus:ring-offset-2 focus:ring-offset-space-900", {
    variants: {
        variant: {
            default: "bg-electric-500/20 text-electric-300 border border-electric-500/30",
            secondary: "bg-space-700 text-slate-300 border border-slate-600/50",
            destructive: "bg-red-500/20 text-red-300 border border-red-500/30",
            emerald: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
            outline: "text-slate-300 border border-slate-600/50 backdrop-blur-sm",
            trust: "trust-badge text-amber-300 font-bold text-xs tracking-wide",
            revolut: "payment-pill-revolut font-medium",
            wise: "payment-pill-wise font-medium",
            paypal: "payment-pill-paypal font-medium",
            verified: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse",
            pending: "bg-slate-600/20 text-slate-400 border border-slate-600/30 animate-pulse",
            address: "bg-space-700/80 text-slate-300 border border-slate-600/30 font-mono text-xs backdrop-blur-sm",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Badge({ className, variant, ...props }) {
    return (<div className={cn(badgeVariants({ variant }), className)} {...props}/>);
}
export { Badge, badgeVariants };
