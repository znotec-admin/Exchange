"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (<input type={type} className={cn("flex h-12 w-full rounded-xl border border-slate-600/50 bg-space-800/60 backdrop-blur-sm px-4 py-3 text-sm text-slate-50 ring-offset-space-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:border-electric-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200", className)} ref={ref} {...props}/>);
});
Input.displayName = "Input";
export { Input };
