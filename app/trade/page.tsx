"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { TickerBar } from "@/components/layout/ticker-bar";
import { MarketCard } from "@/components/trading/market-card";
import { OrderBook, TradeFeed, PlaceOrder } from "@/components/trading";
import { CandleChart, VolumeBar } from "@/components/charts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/shadcn";
import { useMarket } from "@/contexts/market-context";
import { useLang } from "@/contexts/lang-context";
import { fmtPct } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Menu, X, ChevronLeft } from "lucide-react";

const TF = ["1M", "5M", "15M", "1H", "4H", "1D"];
const SUPPLIERS = [
  {
    id: 1,
    name: "สยามอะกริ จำกัด",
    nameEn: "Siam Agri Co.",
    rating: 4.8,
    trades: 1247,
    verified: true,
    loc: "นครราชสีมา",
    locEn: "Nakhon Ratchasima",
  },
  {
    id: 2,
    name: "ไทยปุ๋ยกลาง จำกัด",
    nameEn: "Thai Fertilizer Co.",
    rating: 4.6,
    trades: 892,
    verified: true,
    loc: "กรุงเทพฯ",
    locEn: "Bangkok",
  },
  {
    id: 3,
    name: "เกษตรวัตถุดิบ จำกัด",
    nameEn: "Agri Raw Co.",
    rating: 4.3,
    trades: 445,
    verified: false,
    loc: "เชียงใหม่",
    locEn: "Chiang Mai",
  },
];

export default function TradePage() {
  const { market, selectedId, setSelectedId, selected } = useMarket();
  const { lang, tr } = useLang();
  const [tf, setTf] = useState("1H");
  const [showMarketList, setShowMarketList] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const isUp = (selected?.change ?? 0) >= 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <TickerBar />

      {/* Mobile Header Controls */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b bg-muted/20 sticky top-[53px] z-30">
        <button
          onClick={() => setShowMarketList(!showMarketList)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-sm font-semibold">{selected?.symbol || tr.commodity}</span>
        </button>
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
        >
          <svg className={`w-5 h-5 transition-transform ${showRightPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-wrap lg:flex-nowrap overflow-visible">
        {/* Mobile Market List Overlay */}
        {showMarketList && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                <span className="text-sm font-bold">{tr.commodity}</span>
                <button
                  onClick={() => setShowMarketList(false)}
                  className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ScrollArea className="flex-1 px-4 py-3">
                <div className="flex flex-col gap-2">
                  {market.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowMarketList(false);
                      }}
                    >
                      <MarketCard
                        item={item}
                        selected={selectedId === item.id}
                        onClick={() => {}}
                        lang={lang}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Left: Market List - Desktop */}
        <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 border-r bg-muted/5 overflow-hidden">
          <div className="px-3 pt-3 pb-2 border-b bg-muted/10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {tr.commodity}
            </p>
          </div>
          <ScrollArea className="flex-1 px-3 py-2">
            <div className="flex flex-col gap-2">
              {market.map((item) => (
                <MarketCard
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                  lang={lang}
                />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Center */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex flex-col gap-0 lg:border-r">
          {/* Chart */}
          <Card className="flex-shrink-0 rounded-xl border-x-0 border-t-0 border-b bg-gradient-to-b from-card to-muted/10 shadow-elevation-sm">
            <CardHeader className="border-b px-4 sm:px-5 py-3 sm:py-4 bg-muted/10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="font-mono font-bold text-base sm:text-lg">
                    {selected?.symbol}
                  </span>
                  <span className="text-xs text-muted-foreground hidden md:block">
                    {lang === "th" ? selected?.name : selected?.nameEn}
                  </span>
                  <Badge
                    variant={isUp ? "bull" : "bear"}
                    className="font-mono text-xs sm:text-sm px-2.5 py-1"
                  >
                    ฿
                    {selected?.price.toLocaleString("th-TH", {
                      maximumFractionDigits: 0,
                    })}
                  </Badge>
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-mono font-semibold px-2 py-0.5 rounded-md",
                      isUp ? "bg-bull/12 text-bull" : "bg-bear/12 text-bear",
                    )}
                  >
                    {fmtPct(selected?.change ?? 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div className="hidden sm:flex gap-2.5 sm:gap-4 text-xs">
                    {[
                      {
                        l: tr.high24h,
                        v: `฿${selected?.high24h.toLocaleString("th-TH", { maximumFractionDigits: 0 })}`,
                        c: "text-bull",
                      },
                      {
                        l: tr.low24h,
                        v: `฿${selected?.low24h.toLocaleString("th-TH", { maximumFractionDigits: 0 })}`,
                        c: "text-bear",
                      },
                    ].map((s) => (
                      <div key={s.l} className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40">
                        <span className="text-muted-foreground">{s.l}</span>
                        <span className={cn("font-mono font-semibold", s.c)}>
                          {s.v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 bg-muted/50 p-0.5 rounded-lg">
                    {TF.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTf(t)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                          tf === t
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-2">
              {selected && (
                <>
                  <div className="rounded-lg border bg-card/80 backdrop-blur p-2 shadow-sm">
                    <CandleChart candles={selected.candles} />
                  </div>
                  <div className="rounded-lg bg-muted/20 p-1.5">
                    <VolumeBar candles={selected.candles} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Book + Trade Feed */}
          <div className="grid grid-cols-2 flex-1 min-h-0 overflow-hidden divide-x">
            <div className="overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b bg-muted/15">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {tr.orderBook}
                </span>
              </div>
              <ScrollArea className="flex-1">
                {selected && <OrderBook mid={selected.price} tr={tr} />}
              </ScrollArea>
            </div>
            <div className="overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b bg-muted/15">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {tr.recentTrades}
                </span>
              </div>
              <ScrollArea className="flex-1">
                {selected && <TradeFeed mid={selected.price} tr={tr} />}
              </ScrollArea>
            </div>
          </div>
        </main>

        {/* Right */}
        <aside className={`fixed inset-y-0 right-0 z-40 w-[280px] lg:w-[264px] lg:static flex-shrink-0 overflow-hidden flex flex-col divide-y bg-muted/5 shadow-elevation-lg lg:shadow-none transition-transform duration-300 ${showRightPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-muted/20">
            <span className="text-sm font-bold">{tr.placeOrder}</span>
            <button
              onClick={() => setShowRightPanel(false)}
              className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Place Order */}
          <div className="flex-shrink-0">
            <div className="hidden lg:block px-4 py-2.5 border-b bg-muted/10">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {tr.placeOrder}
              </span>
            </div>
            {selected && (
              <div className="p-3">
                <PlaceOrder commodity={selected} lang={lang} tr={tr} />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            {/* Asset Info */}
            <div>
              <div className="px-4 py-2.5 bg-muted/10 border-b">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {tr.productInfo}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {[
                  [tr.grade, selected?.grade],
                  [
                    tr.origin,
                    lang === "th" ? selected?.origin : selected?.originEn,
                  ],
                  [
                    tr.category,
                    lang === "th" ? selected?.category : selected?.categoryEn,
                  ],
                  [tr.unit, lang === "th" ? selected?.unit : selected?.unitEn],
                ].map(([k, v]) => (
                  <div
                    key={k as string}
                    className="flex justify-between items-center"
                  >
                    <span className="text-xs text-muted-foreground">
                      {k}
                    </span>
                    <span className="text-xs font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppliers */}
            <div className="border-t">
              <div className="px-4 py-2.5 bg-muted/10 border-b">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {tr.suppliers}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {SUPPLIERS.map((s) => (
                  <Card
                    key={s.id}
                    className="gap-1.5 py-2.5 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <CardContent className="px-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold truncate max-w-[140px]">
                          {lang === "th" ? s.name : s.nameEn}
                        </span>
                        {s.verified && (
                          <span className="text-xs text-primary font-semibold">
                            {tr.verified}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          ⭐ {s.rating} · {s.trades} {tr.trades}
                        </span>
                        <span>{lang === "th" ? s.loc : s.locEn}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Open Orders */}
            <div className="border-t">
              <div className="px-4 py-2.5 bg-muted/10 border-b">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {tr.openOrders}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {MOCK_ORDERS.filter((o) => o.status === "open").map((o) => (
                  <Card key={o.id} className="gap-1.5 py-2.5">
                    <CardContent className="px-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-sm text-primary">
                          {o.symbol}
                        </span>
                        <Badge
                          variant={o.side === "buy" ? "bull" : "bear"}
                          className="text-xs px-2 py-0.5"
                        >
                          {o.side.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {o.type.toUpperCase()} @ ฿{o.price.toLocaleString()}
                        </span>
                        <span>{o.qty}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Overlay when right panel is open on mobile */}
        {showRightPanel && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowRightPanel(false)}
          />
        )}
      </div>
      </div>
  );
}
