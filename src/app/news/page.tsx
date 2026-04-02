"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { useLang } from "@/contexts/lang-context"
import { MARKET_NEWS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const EXTRA=[
  { id:6, title:"แอมโมเนียเอเชียลด 2.1% หลังจีนเพิ่มกำลังผลิต", titleEn:"Asian ammonia falls 2.1% as China boosts output", time:"1 วัน", timeEn:"1 day ago", tag:"ปุ๋ย", tagEn:"Fertilizer", impact:"bearish" as const },
  { id:7, title:"อาเซียนหารือข้อตกลงการค้าเกษตรใหม่", titleEn:"ASEAN discusses new agricultural trade agreement", time:"2 วัน", timeEn:"2 days ago", tag:"การค้า", tagEn:"Trade", impact:"bullish" as const },
]
const ALL=[...MARKET_NEWS,...EXTRA]

export default function NewsPage() {
  const { lang, tr } = useLang()
  const [filter, setFilter] = useState("all")
  const feats = ALL.slice(0,2)
  const list  = ALL.slice(2).filter(n=>filter==="all"||(filter==="bull"&&n.impact==="bullish")||(filter==="bear"&&n.impact==="bearish"))

  const ImpactIcon=({i}:{i:string})=>i==="bullish"?<TrendingUp className="size-3.5 text-bull"/>:i==="bearish"?<TrendingDown className="size-3.5 text-bear"/>:<Minus className="size-3.5 text-muted-foreground"/>

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar/>
      <TickerBar/>
      <main className="flex-1 p-4 max-w-[1000px] mx-auto w-full">
        <h1 className="text-2xl font-bold font-display mb-5">{tr.newsTitle}</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {feats.map(n=>(
            <Card key={n.id} className="gap-0 py-0 hover:shadow-md cursor-pointer transition-all hover:border-primary/30 overflow-hidden">
              <div className={cn("h-1",n.impact==="bullish"?"bg-bull":n.impact==="bearish"?"bg-bear":"bg-muted-foreground")}/>
              <CardContent className="px-4 pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Badge variant={n.impact==="bullish"?"bull":n.impact==="bearish"?"bear":"muted"} className="text-[9px]">{lang==="th"?n.tag:n.tagEn}</Badge>
                  <div className="flex items-center gap-1">
                    <ImpactIcon i={n.impact}/>
                    <span className={cn("text-[10px] font-semibold",n.impact==="bullish"?"text-bull":n.impact==="bearish"?"text-bear":"text-muted-foreground")}>
                      {n.impact==="bullish"?tr.bullish:n.impact==="bearish"?tr.bearish:tr.neutral}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold leading-relaxed mb-2">{lang==="th"?n.title:n.titleEn}</p>
                <p className="text-[10px] text-muted-foreground">{lang==="th"?n.time:n.timeEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b px-4 py-3 flex-row items-center justify-between space-y-0">
            <CardTitle>{lang==="th"?"ข่าวทั้งหมด":"All News"}</CardTitle>
            <div className="flex gap-1.5">
              {[["all",lang==="th"?"ทั้งหมด":"All"],["bull","▲ "+tr.bullish],["bear","▼ "+tr.bearish]].map(([f,l])=>(
                <button key={f} onClick={()=>setFilter(f)}
                  className={cn("px-3 py-1 text-[10px] font-semibold rounded-full border transition-all",
                    filter===f?"bg-primary text-primary-foreground border-primary":"border-border text-muted-foreground hover:border-primary/50"
                  )}>
                  {l}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {list.map(n=>(
              <div key={n.id} className="flex items-start gap-3 px-4 py-3.5 border-b border-border/40 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors">
                <div className={cn("w-1 self-stretch rounded-full flex-shrink-0",n.impact==="bullish"?"bg-bull":n.impact==="bearish"?"bg-bear":"bg-muted-foreground/40")}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={n.impact==="bullish"?"bull":n.impact==="bearish"?"bear":"muted"} className="text-[8px] h-3.5 px-1.5">{lang==="th"?n.tag:n.tagEn}</Badge>
                    <span className="text-[10px] text-muted-foreground">{lang==="th"?n.time:n.timeEn}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{lang==="th"?n.title:n.titleEn}</p>
                </div>
                <ImpactIcon i={n.impact}/>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
