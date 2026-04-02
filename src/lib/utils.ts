import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = (n: number, d = 0) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: d, maximumFractionDigits: d });

export const fmtPct = (n: number) =>
  (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

export const fmtCurrency = (n: number) => "฿" + fmt(n);
