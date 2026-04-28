"use client";
import { useMarket } from "@/contexts/market-context";
import { fmtPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function TickerBar() {
  const { market } = useMarket();
  const items = [...market, ...market];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("th-TH", {
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="border-b bg-muted/40 py-1.5 ticker-wrap">
      <div className="ticker-inner">
        {items.map((m, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-mono font-semibold text-muted-foreground">
              {m.symbol}
            </span>
            <span className="text-[11px] font-mono font-bold">
              ฿{formatPrice(m.price)}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono font-semibold",
                m.change >= 0 ? "text-bull" : "text-bear",
              )}
            >
              {fmtPct(m.change)}
            </span>
            <span className="text-border/60 text-xs">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
