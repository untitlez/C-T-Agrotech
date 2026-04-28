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
      className={cn("cursor-pointer transition-all duration-200 hover:shadow-elevation-sm",
        selected ? "border-primary bg-primary/10 shadow-elevation-sm" : "hover:border-primary/30"
      )}>
      <CardContent className="px-3 py-3">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <div className={cn("text-xs font-mono font-bold tracking-wide", selected?"text-primary":"text-foreground")}>
              {item.symbol}
            </div>
            <div className="text-[11px] text-muted-foreground truncate mt-0.5">
              {lang==="th" ? item.name : item.nameEn}
            </div>
          </div>
          <Badge variant={item.grade==="A+"?"gold":"muted"} className="text-[10px] px-2 py-0.5">
            {item.grade}
          </Badge>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1">
            <div className="text-sm font-mono font-bold">
              ฿{item.price.toLocaleString("th-TH",{maximumFractionDigits:0})}
            </div>
            <div className={cn("text-[11px] font-mono font-semibold", isUp?"text-bull":"text-bear")}>
              {fmtPct(item.change)}
            </div>
          </div>
          <Sparkline data={item.candles.slice(-20)} color={isUp?"oklch(62% 0.19 152)":"oklch(58% 0.22 25)"} width={80} height={28}/>
        </div>
      </CardContent>
    </Card>
  )
}
