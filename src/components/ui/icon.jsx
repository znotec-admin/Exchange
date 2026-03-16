import Image from "next/image";
import { cn } from "@/lib/utils";

const { brandIcons } = require("@/assets/icons");

export const BRAND_ICONS = Object.keys(brandIcons);

const sizeMap = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function BrandIcon({ name, className, size = "md", alt = "", priority = false }) {
  const px = typeof size === "number" ? size : sizeMap[size];
  const src = brandIcons[name];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={cn("shrink-0 inline-block", className)}
      priority={priority}
      unoptimized
    />
  );
}
