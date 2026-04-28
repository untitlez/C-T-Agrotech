"use client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Sparkline } from "@/components/charts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import { useMarket } from "@/contexts/market-context"
import { useLang } from "@/contexts/lang-context"
import { fmtPct } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { MARKET_NEWS } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { useState } from "react"

export default function MarketPage() {
  const { market, setSelectedId } = useMarket()
  const { lang, tr } = useLang()
  const router = useRouter()
  const [filter, setFilter] = useState("all")

  const filtered = filter==="all" ? market : market.filter(m=>(lang==="th"?m.category:m.categoryEn)===filter)
  const bull = market.filter(m=>m.change>=0).length

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar/>
      <TickerBar/>
      <main className="flex-1 p-4 max-w-[1400px] mx-auto w-full">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            {l:lang==="th"?"สินค้าทั้งหมด":"Total Commodities", v:market.length, icon:<BarChart3 className="size-4"/>, c:"text-primary"},
            {l:tr.bullish, v:bull, icon:<TrendingUp className="size-4"/>, c:"text-bull"},
            {l:tr.bearish, v:market.length-bull, icon:<TrendingDown className="size-4"/>, c:"text-bear"},
            {l:lang==="th"?"มูลค่า 24H":"Market Vol 24H", v:`฿${(market.reduce((s,m)=>s+m.price*m.volume,0)/1e6).toFixed(1)}M`, icon:<BarChart3 className="size-4"/>, c:"text-primary"},
          ].map(s=>(
            <Card key={s.l}>
              <CardContent className="pt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">{s.l}</p>
                    <p className={cn("text-2xl font-bold font-mono", s.c)}>{s.v}</p>
                  </div>
                  <div className={cn("p-2 rounded-lg bg-muted mt-1", s.c)}>{s.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Table */}
          <div className="col-span-2">
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3 flex-row items-center justify-between space-y-0">
                <CardTitle>{tr.commodity}</CardTitle>
                <div className="flex gap-1.5">
                  {["all","ปุ๋ย","สารเคมี"].map(f=>(
                    <Button key={f} variant={filter===f?"default":"outline"} size="sm" className="h-7 text-xs"
                      onClick={()=>setFilter(f)}>
                      {f==="all"?(lang==="th"?"ทั้งหมด":"All"):lang==="th"?f:f==="ปุ๋ย"?"Fertilizer":"Chemical"}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {[tr.commodity, tr.symbol, tr.lastPrice, tr.change, tr.volume24h, tr.grade, tr.origin, ""].map(h=>(
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item=>{
                      const isUp=item.change>=0
                      return (
                        <tr key={item.id} onClick={()=>{setSelectedId(item.id);router.push("/trade")}}
                          className="border-b border-border/40 hover:bg-muted/40 cursor-pointer transition-colors group">
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold group-hover:text-primary transition-colors">{lang==="th"?item.name:item.nameEn}</div>
                            <div className="text-[12px] text-muted-foreground">{lang==="th"?item.category:item.categoryEn}</div>
                          </td>
                          <td className="px-4 py-3"><span className="font-mono font-bold text-xs text-primary">{item.symbol}</span></td>
                          <td className="px-4 py-3 font-mono font-bold text-sm">฿{item.price.toLocaleString("th-TH",{maximumFractionDigits:0})}</td>
                          <td className="px-4 py-3"><span className={cn("text-xs font-mono font-semibold",isUp?"text-bull":"text-bear")}>{fmtPct(item.change)}</span></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{item.volume.toLocaleString("th-TH",{maximumFractionDigits:0})} {lang==="th"?item.unit:item.unitEn}</td>
                          <td className="px-4 py-3"><Badge variant={item.grade==="A+"?"gold":"muted"} className="text-[11px]">{item.grade}</Badge></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{lang==="th"?item.origin:item.originEn}</td>
                          <td className="px-4 py-3"><Sparkline data={item.candles.slice(-20)} color={isUp?"#10b981":"#ef4444"} width={80} height={26}/></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* News */}
          <Card className="gap-0 py-0">
            <CardHeader className="border-b px-4 py-3">
              <CardTitle>{tr.newsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {MARKET_NEWS.map(n=>(
                <div key={n.id} className="px-4 py-3 border-b border-border/40 hover:bg-muted/30 cursor-pointer transition-colors last:border-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={n.impact==="bullish"?"bull":n.impact==="bearish"?"bear":"muted"} className="text-[8px] h-3.5 px-1.5">
                      {lang==="th"?n.tag:n.tagEn}
                    </Badge>
                    <span className={cn("text-[12px] font-semibold",n.impact==="bullish"?"text-bull":n.impact==="bearish"?"text-bear":"text-muted-foreground")}>
                      {n.impact==="bullish"?"▲ "+tr.bullish:n.impact==="bearish"?"▼ "+tr.bearish:"— "+tr.neutral}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed mb-1">{lang==="th"?n.title:n.titleEn}</p>
                  <p className="text-[12px] text-muted-foreground">{lang==="th"?n.time:n.timeEn}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
