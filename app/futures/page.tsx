"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import { useMarket } from "@/contexts/market-context"
import { useLang } from "@/contexts/lang-context"
import { generateFutures } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function FuturesPage() {
  const { market } = useMarket()
  const { lang, tr } = useLang()
  const futures = generateFutures(market)
  const [term, setTerm] = useState<"ALL"|"3M"|"6M"|"12M">("ALL")
  const [bought, setBought] = useState<Set<string>>(new Set())

  const filtered = term==="ALL" ? futures : futures.filter(f=>f.term===term)
  const grouped = filtered.reduce((acc,f)=>{ (acc[f.commodityId]??=[]).push(f); return acc },{} as Record<string,typeof filtered>)

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar/>
      <TickerBar/>
      <main className="flex-1 p-4 max-w-[1300px] mx-auto w-full">
        <div className="mb-5">
          <h1 className="text-2xl font-bold font-display mb-1">{tr.futuresTitle}</h1>
          <p className="text-sm text-muted-foreground">{tr.futuresDesc}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {l:lang==="th"?"สัญญาทั้งหมด":"Total Contracts", v:futures.length},
            {l:lang==="th"?"Open Interest รวม":"Total Open Interest", v:futures.reduce((s,f)=>s+f.openInterest,0).toLocaleString()},
            {l:lang==="th"?"มูลค่ารวม":"Total Value", v:`฿${(futures.reduce((s,f)=>s+f.futurePrice*f.openInterest,0)/1e9).toFixed(1)}B`},
          ].map(s=>(
            <Card key={s.l}>
              <CardContent className="pt-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{s.l}</p>
                <p className="text-2xl font-bold font-mono text-primary">{s.v}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Warning */}
        <div className="flex gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 mb-5">
          <span className="text-lg">⚠️</span>
          <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
            {lang==="th"?"การซื้อขาย Futures มีความเสี่ยง ต้องวาง Margin ขั้นต่ำ 10% ของมูลค่าสัญญา กรุณาศึกษาข้อกำหนดก่อนลงทุน":"Futures trading involves risk. Minimum margin of 10% of contract value required. Please read the terms before investing."}
          </p>
        </div>

        {/* Term filter */}
        <div className="flex gap-2 mb-5">
          {(["ALL","3M","6M","12M"] as const).map(t=>(
            <Button key={t} variant={term===t?"default":"outline"} size="sm" onClick={()=>setTerm(t)}>
              {t==="ALL"?(lang==="th"?"ทั้งหมด":"All"):t}
            </Button>
          ))}
        </div>

        {/* Futures by commodity */}
        {Object.entries(grouped).map(([cid,contracts])=>{
          const item = market.find(m=>m.id===cid)
          if (!item) return null
          return (
            <div key={cid} className="mb-6">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <span className="font-mono font-bold text-sm text-primary">{item.symbol}</span>
                <span className="text-sm text-muted-foreground">{lang==="th"?item.name:item.nameEn}</span>
                <Badge variant="tiffany" className="text-[9px]">
                  Spot ฿{item.price.toLocaleString("th-TH",{maximumFractionDigits:0})}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {contracts.map(f=>{
                  const isBought=bought.has(f.id)
                  return (
                    <Card key={f.id} className="hover:shadow-md hover:border-primary/30 transition-all gap-3 py-4">
                      <CardContent className="px-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-mono font-bold text-sm">{f.symbol}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {tr.delivery}: {lang==="th"?f.deliveryDate:f.deliveryDateEn}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[9px]">FUTURES</Badge>
                        </div>
                        <div className="text-2xl font-bold font-mono mb-3">
                          ฿{f.futurePrice.toLocaleString("th-TH",{maximumFractionDigits:0})}
                        </div>
                        <div className="flex flex-col gap-1.5 mb-3 pt-3 border-t">
                          {[
                            [tr.spotPrice, `฿${f.spotPrice.toLocaleString("th-TH",{maximumFractionDigits:0})}`],
                            [tr.premium, `+${f.premium.toFixed(1)}%`, "text-amber-500"],
                            [tr.openInterest, f.openInterest.toLocaleString()],
                            [lang==="th"?"Margin (10%)":"Margin (10%)", `฿${(f.futurePrice*0.1).toLocaleString("th-TH",{maximumFractionDigits:0})}/ตัน`],
                          ].map(([k,v,c])=>(
                            <div key={k as string} className="flex justify-between">
                              <span className="text-[10px] text-muted-foreground">{k}</span>
                              <span className={cn("text-[10px] font-mono font-semibold", c as string)}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant={isBought?"outline":"default"} size="sm" className="w-full text-xs h-8"
                          onClick={()=>setBought(prev=>new Set([...prev,f.id]))}>
                          {isBought?`✓ ${lang==="th"?"ซื้อแล้ว":"Purchased"}`:tr.buyContract}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
