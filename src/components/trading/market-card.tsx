"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Sparkline } from "@/components/charts"
import { fmtPct } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { MarketItem, Language } from "@/types"

export function MarketCard({ item, selected, onClick, lang }: { item:MarketItem; selected:boolean; onClick:()=>void; lang:Language }) {
  const isUp = item.change >= 0
  return (
    <Card onClick={onClick}
      className={cn("cursor-pointer gap-3 py-3 transition-all duration-150 hover:shadow-sm",
        selected ? "border-primary/50 bg-primary/5 shadow-sm" : "hover:border-border/80"
      )}>
      <CardContent className="px-3">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <div className={cn("text-[11px] font-mono font-bold tracking-wide", selected?"text-primary":"text-foreground")}>
              {item.symbol}
            </div>
            <div className="text-[10px] text-muted-foreground truncate mt-0.5 max-w-[100px]">
              {lang==="th" ? item.name : item.nameEn}
            </div>
          </div>
          <Badge variant={item.grade==="A+"?"gold":"muted"} className="text-[9px] h-4 px-1.5">
            {item.grade}
          </Badge>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[13px] font-mono font-bold">
              ฿{item.price.toLocaleString("th-TH",{maximumFractionDigits:0})}
            </div>
            <div className={cn("text-[10px] font-mono font-semibold", isUp?"text-bull":"text-bear")}>
              {fmtPct(item.change)}
            </div>
          </div>
          <Sparkline data={item.candles.slice(-20)} color={isUp?"#10b981":"#ef4444"} width={76} height={26}/>
        </div>
      </CardContent>
    </Card>
  )
}
