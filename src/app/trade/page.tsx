"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { MarketCard } from "@/components/trading/market-card"
import { OrderBook, TradeFeed, PlaceOrder } from "@/components/trading"
import { CandleChart, VolumeBar } from "@/components/charts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/shadcn"
import { useMarket } from "@/contexts/market-context"
import { useLang } from "@/contexts/lang-context"
import { fmtPct } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { MOCK_ORDERS } from "@/lib/mock-data"

const TF = ["1M","5M","15M","1H","4H","1D"]
const SUPPLIERS = [
  { id:1, name:"สยามอะกริ จำกัด", nameEn:"Siam Agri Co.", rating:4.8, trades:1247, verified:true, loc:"นครราชสีมา", locEn:"Nakhon Ratchasima" },
  { id:2, name:"ไทยปุ๋ยกลาง จำกัด", nameEn:"Thai Fertilizer Co.", rating:4.6, trades:892, verified:true, loc:"กรุงเทพฯ", locEn:"Bangkok" },
  { id:3, name:"เกษตรวัตถุดิบ จำกัด", nameEn:"Agri Raw Co.", rating:4.3, trades:445, verified:false, loc:"เชียงใหม่", locEn:"Chiang Mai" },
]

export default function TradePage() {
  const { market, selectedId, setSelectedId, selected } = useMarket()
  const { lang, tr } = useLang()
  const [tf, setTf] = useState("1H")
  const isUp = (selected?.change??0)>=0

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar/>
      <TickerBar/>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Market List */}
        <aside className="w-[208px] flex-shrink-0 border-r overflow-hidden flex flex-col">
          <div className="px-2 pt-2 pb-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-1">{tr.commodity}</p>
          </div>
          <ScrollArea className="flex-1 px-2 pb-2">
            <div className="flex flex-col gap-1.5">
              {market.map(item=>(
                <MarketCard key={item.id} item={item} selected={selectedId===item.id} onClick={()=>setSelectedId(item.id)} lang={lang}/>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Center */}
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col gap-0 border-r">
          {/* Chart */}
          <Card className="flex-shrink-0 rounded-none border-0 border-b gap-0 py-0">
            <CardHeader className="border-b px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-base">{selected?.symbol}</span>
                  <span className="text-xs text-muted-foreground hidden md:block">{lang==="th"?selected?.name:selected?.nameEn}</span>
                  <Badge variant={isUp?"bull":"bear"} className="font-mono text-[11px]">
                    ฿{selected?.price.toLocaleString("th-TH",{maximumFractionDigits:0})}
                  </Badge>
                  <span className={cn("text-xs font-mono font-semibold", isUp?"text-bull":"text-bear")}>{fmtPct(selected?.change??0)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex gap-3 text-[10px]">
                    {[
                      {l:tr.high24h, v:`฿${selected?.high24h.toLocaleString("th-TH",{maximumFractionDigits:0})}`, c:"text-bull"},
                      {l:tr.low24h,  v:`฿${selected?.low24h.toLocaleString("th-TH",{maximumFractionDigits:0})}`, c:"text-bear"},
                    ].map(s=>(
                      <div key={s.l} className="flex items-center gap-1">
                        <span className="text-muted-foreground">{s.l}</span>
                        <span className={cn("font-mono font-semibold",s.c)}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-0.5">
                    {TF.map(t=>(
                      <button key={t} onClick={()=>setTf(t)}
                        className={cn("px-2 py-0.5 rounded text-[10px] font-bold transition-all",
                          tf===t?"bg-primary/15 text-primary":"text-muted-foreground hover:text-foreground"
                        )}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 px-1 pt-1">
              {selected && <CandleChart candles={selected.candles}/>}
              {selected && <VolumeBar candles={selected.candles}/>}
            </CardContent>
          </Card>

          {/* Order Book + Trade Feed */}
          <div className="grid grid-cols-2 flex-1 min-h-0 overflow-hidden divide-x">
            <div className="overflow-hidden flex flex-col">
              <div className="px-3 py-2 border-b bg-muted/30">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tr.orderBook}</span>
              </div>
              <ScrollArea className="flex-1">
                {selected && <OrderBook mid={selected.price} tr={tr}/>}
              </ScrollArea>
            </div>
            <div className="overflow-hidden flex flex-col">
              <div className="px-3 py-2 border-b bg-muted/30">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tr.recentTrades}</span>
              </div>
              <ScrollArea className="flex-1">
                {selected && <TradeFeed mid={selected.price} tr={tr}/>}
              </ScrollArea>
            </div>
          </div>
        </main>

        {/* Right */}
        <aside className="w-[252px] flex-shrink-0 overflow-hidden flex flex-col divide-y">
          {/* Place Order */}
          <div className="flex-shrink-0">
            <div className="px-3 py-2 border-b bg-muted/30">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tr.placeOrder}</span>
            </div>
            {selected && <PlaceOrder commodity={selected} lang={lang} tr={tr}/>}
          </div>

          <ScrollArea className="flex-1">
            {/* Asset Info */}
            <div>
              <div className="px-3 py-2 bg-muted/30 border-b">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tr.productInfo}</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {[
                  [tr.grade, selected?.grade],
                  [tr.origin, lang==="th"?selected?.origin:selected?.originEn],
                  [tr.category, lang==="th"?selected?.category:selected?.categoryEn],
                  [tr.unit, lang==="th"?selected?.unit:selected?.unitEn],
                ].map(([k,v])=>(
                  <div key={k as string} className="flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground">{k}</span>
                    <span className="text-[11px] font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppliers */}
            <div className="border-t">
              <div className="px-3 py-2 bg-muted/30 border-b">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tr.suppliers}</span>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                {SUPPLIERS.map(s=>(
                  <Card key={s.id} className="gap-1 py-2 hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="px-2.5">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-semibold truncate max-w-[130px]">{lang==="th"?s.name:s.nameEn}</span>
                        {s.verified && <span className="text-[9px] text-primary font-semibold">{tr.verified}</span>}
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>⭐ {s.rating} · {s.trades} {tr.trades}</span>
                        <span>{lang==="th"?s.loc:s.locEn}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Open Orders */}
            <div className="border-t">
              <div className="px-3 py-2 bg-muted/30 border-b">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tr.openOrders}</span>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                {MOCK_ORDERS.filter(o=>o.status==="open").map(o=>(
                  <Card key={o.id} className="gap-1 py-2">
                    <CardContent className="px-2.5">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-mono font-bold text-xs text-primary">{o.symbol}</span>
                        <Badge variant={o.side==="buy"?"bull":"bear"} className="text-[8px] h-3.5 px-1">{o.side.toUpperCase()}</Badge>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{o.type.toUpperCase()} @ ฿{o.price.toLocaleString()}</span>
                        <span>{o.qty}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  )
}
