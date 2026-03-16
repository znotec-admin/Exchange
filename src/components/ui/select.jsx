"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
const Select = React.forwardRef(({ className, options, ...props }, ref) => {
    return (<div className="relative">
        <select className={cn("flex h-11 w-full rounded-lg border border-gray-600 bg-navy-700/50 px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer", className)} ref={ref} {...props}>
          {options.map((option) => (<option key={option.value} value={option.value} className="bg-navy-800 text-white">
              {option.label}
            </option>))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"/>
      </div>);
});
Select.displayName = "Select";
export { Select };
