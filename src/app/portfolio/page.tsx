"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import { useMarket } from "@/contexts/market-context"
import { useLang } from "@/contexts/lang-context"
import { MOCK_ORDERS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Package, TrendingUp, Wallet, Clock } from "lucide-react"

const HOLDINGS=[
  { commodityId:"NPK161616", symbol:"NPK16", name:"ปุ๋ย NPK 16-16-16", nameEn:"NPK Fertilizer 16-16-16", qty:50, avgPrice:18100, unit:"ตัน", unitEn:"ton" },
  { commodityId:"UREA46",    symbol:"UREA",  name:"ปุ๋ยยูเรีย 46%",    nameEn:"Urea 46%",              qty:30, avgPrice:21500, unit:"ตัน", unitEn:"ton" },
  { commodityId:"POTASH",    symbol:"KCL",   name:"โพแทสเซียมคลอไรด์", nameEn:"Potassium Chloride",    qty:20, avgPrice:16500, unit:"ตัน", unitEn:"ton" },
]

export default function PortfolioPage() {
  const { market } = useMarket()
  const { lang, tr } = useLang()

  const positions = HOLDINGS.map(h=>{
    const cur = market.find(m=>m.id===h.commodityId)?.price ?? h.avgPrice
    return { ...h, curPrice:cur }
  })
  const totalVal  = positions.reduce((s,p)=>s+p.qty*p.curPrice,0)
  const totalCost = positions.reduce((s,p)=>s+p.qty*p.avgPrice,0)
  const totalPnl  = totalVal-totalCost
  const todayPnl  = totalVal*0.0128

  const stats=[
    { l:tr.portfolioValue, v:`฿${totalVal.toLocaleString("th-TH",{maximumFractionDigits:0})}`, sub:`${positions.length} ${lang==="th"?"สินค้า":"items"}`, icon:<Package className="size-4"/>, c:"text-primary" },
    { l:tr.profitLoss, v:`${totalPnl>=0?"+":""}฿${Math.abs(totalPnl).toLocaleString("th-TH",{maximumFractionDigits:0})}`, sub:`${((totalPnl/totalCost)*100).toFixed(2)}%`, icon:<TrendingUp className="size-4"/>, c:totalPnl>=0?"text-bull":"text-bear" },
    { l:tr.todayPnl, v:`+฿${todayPnl.toLocaleString("th-TH",{maximumFractionDigits:0})}`, sub:"+1.28%", icon:<TrendingUp className="size-4"/>, c:"text-bull" },
    { l:tr.liquidity, v:"฿2,450,000", sub:lang==="th"?"พร้อมใช้":"Available", icon:<Wallet className="size-4"/>, c:"text-foreground" },
  ]

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar/>
      <TickerBar/>
      <main className="flex-1 p-4 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-4 gap-3 mb-5">
          {stats.map(s=>(
            <Card key={s.l}>
              <CardContent className="pt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{s.l}</p>
                    <p className={cn("text-xl font-bold font-mono", s.c)}>{s.v}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                  </div>
                  <div className={cn("p-2 rounded-lg bg-muted mt-1", s.c)}>{s.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-4">
            {/* Holdings */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3"><CardTitle>{tr.holdings}</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead><tr className="border-b">{[tr.commodity,tr.quantity,tr.avgPrice,tr.currentPrice,tr.value,"P&L"].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider last:text-right">{h}</th>
                  ))}</tr></thead>
                  <tbody>
                    {positions.map(pos=>{
                      const val=pos.qty*pos.curPrice, pnl=(pos.curPrice-pos.avgPrice)*pos.qty
                      const pct=((pos.curPrice-pos.avgPrice)/pos.avgPrice)*100, up=pnl>=0
                      return (
                        <tr key={pos.symbol} className="border-b border-border/40 hover:bg-muted/30">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-sm">{lang==="th"?pos.name:pos.nameEn}</div>
                            <div className="text-[10px] text-primary font-mono">{pos.symbol}</div>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-sm">{pos.qty} <span className="text-[10px] text-muted-foreground">{lang==="th"?pos.unit:pos.unitEn}</span></td>
                          <td className="px-4 py-3.5 font-mono text-sm">฿{pos.avgPrice.toLocaleString("th-TH",{maximumFractionDigits:0})}</td>
                          <td className="px-4 py-3.5 font-mono text-sm font-semibold">฿{pos.curPrice.toLocaleString("th-TH",{maximumFractionDigits:0})}</td>
                          <td className="px-4 py-3.5 font-mono text-sm">฿{val.toLocaleString("th-TH",{maximumFractionDigits:0})}</td>
                          <td className="px-4 py-3.5 text-right">
                            <div className={cn("font-mono text-sm font-bold",up?"text-bull":"text-bear")}>{up?"+":""}฿{Math.abs(pnl).toLocaleString("th-TH",{maximumFractionDigits:0})}</div>
                            <div className={cn("text-[10px] font-mono",up?"text-bull":"text-bear")}>{up?"+":""}{pct.toFixed(2)}%</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle className="flex items-center gap-1.5"><Clock className="size-3.5"/>{tr.openOrders}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead><tr className="border-b">{["ID",tr.symbol,tr.type,tr.side,tr.price,tr.quantity,tr.status,lang==="th"?"วันที่":"Date"].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}</tr></thead>
                  <tbody>
                    {MOCK_ORDERS.map(o=>(
                      <tr key={o.id} className="border-b border-border/40 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono text-[9px] text-muted-foreground">{o.id}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-xs text-primary">{o.symbol}</td>
                        <td className="px-4 py-2.5 text-xs uppercase text-muted-foreground">{o.type}</td>
                        <td className="px-4 py-2.5"><Badge variant={o.side==="buy"?"bull":"bear"} className="text-[9px]">{o.side.toUpperCase()}</Badge></td>
                        <td className="px-4 py-2.5 font-mono text-xs">฿{o.price.toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono text-xs">{o.qty}</td>
                        <td className="px-4 py-2.5"><Badge variant={o.status==="filled"?"bull":o.status==="open"?"muted":"bear"} className="text-[9px]">{o.status}</Badge></td>
                        <td className="px-4 py-2.5 text-[10px] text-muted-foreground">{o.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-4">
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3"><CardTitle>{tr.allocation}</CardTitle></CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                {positions.map(pos=>{
                  const val=pos.qty*pos.curPrice, pct=(val/totalVal)*100, up=(pos.curPrice-pos.avgPrice)>=0
                  return (
                    <div key={pos.symbol}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium">{pos.symbol}</span>
                        <span className="text-xs font-mono">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full",up?"bg-bull":"bg-bear")} style={{width:`${pct}%`}}/>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[10px] text-muted-foreground">฿{val.toLocaleString("th-TH",{maximumFractionDigits:0})}</span>
                        <span className={cn("text-[10px] font-mono",up?"text-bull":"text-bear")}>{up?"+":""}{(((pos.curPrice-pos.avgPrice)/pos.avgPrice)*100).toFixed(2)}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3"><CardTitle>{tr.accountSummary}</CardTitle></CardHeader>
              <CardContent className="pt-0 flex flex-col divide-y">
                {[
                  {k:lang==="th"?"มูลค่ารวม":"Total Portfolio", v:`฿${(totalVal+2450000).toLocaleString("th-TH",{maximumFractionDigits:0})}`, bold:true},
                  {k:lang==="th"?"สินค้าถือ":"Positions", v:`฿${totalVal.toLocaleString("th-TH",{maximumFractionDigits:0})}`},
                  {k:lang==="th"?"เงินสด":"Cash", v:"฿2,450,000"},
                  {k:"P&L", v:`${totalPnl>=0?"+":""}฿${Math.abs(totalPnl).toLocaleString("th-TH",{maximumFractionDigits:0})}`, c:totalPnl>=0?"text-bull":"text-bear"},
                ].map(r=>(
                  <div key={r.k} className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-muted-foreground">{r.k}</span>
                    <span className={cn("text-[12px] font-mono", r.bold?"font-bold":"font-medium", r.c)}>{r.v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
