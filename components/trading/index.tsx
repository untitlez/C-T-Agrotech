"use client";
import { useEffect, useState } from "react";
import { generateOrderBook, generateTrades } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { Label } from "@/components/ui/primitives";
import { Separator } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type {
  Trade,
  MarketItem,
  Language,
  OrderType,
  OrderSide,
} from "@/types";

/* ─── Order Book ─────────────────────────────────────────────── */
export function OrderBook({ mid, tr }: { mid: number; tr: any }) {
  const [book, setBook] = useState(() => generateOrderBook(mid));
  const maxT = Math.max(
    ...book.bids.map((b) => b.total),
    ...book.asks.map((a) => a.total),
  );

  useEffect(() => {
    const t = setInterval(
      () =>
        setBook(generateOrderBook(mid * (1 + (Math.random() - 0.5) * 0.002))),
      2000,
    );
    return () => clearInterval(t);
  }, [mid]);

  const ColHeader = () => (
    <div className="grid grid-cols-3 px-3 py-1.5 border-b">
      {[tr.price, tr.quantity, tr.total].map((h, i) => (
        <span
          key={h}
          className={cn(
            "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
            i === 1 ? "text-center" : i === 2 ? "text-right" : "",
          )}
        >
          {h}
        </span>
      ))}
    </div>
  );

  return (
    <div className="text-[11px] font-mono">
      <ColHeader />
      {[...book.asks].reverse().map((a, i) => (
        <div
          key={i}
          className="relative grid grid-cols-3 px-3 py-[2.5px] hover:bg-bear/10"
        >
          <div
            className="absolute right-0 inset-y-0 bg-bear/10 transition-all"
            style={{ width: `${(a.total / maxT) * 100}%` }}
          />
          <span className="relative text-bear">{a.price.toLocaleString()}</span>
          <span className="relative text-center text-muted-foreground">
            {a.qty}
          </span>
          <span className="relative text-right text-muted-foreground/60">
            {a.total}
          </span>
        </div>
      ))}
      <div className="text-center py-1.5 border-y my-0.5">
        <span className="text-sm font-bold font-mono text-bull">
          {mid.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
        </span>
        <span className="text-[11px] text-muted-foreground ml-2">
          {tr.midPrice}
        </span>
      </div>
      {book.bids.map((b, i) => (
        <div
          key={i}
          className="relative grid grid-cols-3 px-3 py-[2.5px] hover:bg-bull/10"
        >
          <div
            className="absolute right-0 inset-y-0 bg-bull/10 transition-all"
            style={{ width: `${(b.total / maxT) * 100}%` }}
          />
          <span className="relative text-bull">{b.price.toLocaleString()}</span>
          <span className="relative text-center text-muted-foreground">
            {b.qty}
          </span>
          <span className="relative text-right text-muted-foreground/60">
            {b.total}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Trade Feed ─────────────────────────────────────────────── */
export function TradeFeed({ mid, tr }: { mid: number; tr: any }) {
  const [trades, setTrades] = useState<Trade[]>(() => generateTrades(mid));

  useEffect(() => {
    const t = setInterval(() => {
      const side = Math.random() > 0.5 ? "buy" : ("sell" as "buy" | "sell");
      setTrades((prev) => [
        {
          id: `T${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          price: Math.round(mid * (1 + (Math.random() - 0.5) * 0.008)),
          qty: +(Math.random() * 20 + 1).toFixed(2),
          side,
          time: new Date().toLocaleTimeString("th-TH"),
        },
        ...prev.slice(0, 19),
      ]);
    }, 1500);
    return () => clearInterval(t);
  }, [mid]);

  return (
    <div className="font-mono text-[11px]">
      <div className="grid grid-cols-4 px-3 py-1.5 border-b">
        {[tr.time, tr.price, tr.quantity, "B/S"].map((h, i) => (
          <span
            key={i}
            className={cn(
              "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
              i === 2 ? "text-center" : i === 3 ? "text-right" : "",
            )}
          >
            {h}
          </span>
        ))}
      </div>
      {trades.map((trade, i) => (
        <div
          key={trade.id}
          className={cn(
            "grid grid-cols-4 px-3 py-[2.5px]",
            i === 0 && "bg-muted/40",
          )}
        >
          <span className="text-muted-foreground text-[11px] pt-px">
            {trade.time}
          </span>
          <span
            className={cn(
              "font-semibold",
              trade.side === "buy" ? "text-bull" : "text-bear",
            )}
          >
            {trade.price.toLocaleString()}
          </span>
          <span className="text-center text-muted-foreground">{trade.qty}</span>
          <span
            className={cn(
              "text-right font-bold text-[12px]",
              trade.side === "buy" ? "text-bull" : "text-bear",
            )}
          >
            {trade.side === "buy" ? "B" : "S"}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Place Order ────────────────────────────────────────────── */
export function PlaceOrder({
  commodity,
  lang,
  tr,
}: {
  commodity: MarketItem;
  lang: Language;
  tr: any;
}) {
  const [side, setSide] = useState<OrderSide>("buy");
  const [type, setType] = useState<OrderType>("market");
  const [price, setPrice] = useState(commodity.price);
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const unitPrice = type === "market" ? commodity.price : price;
  const total = qty ? unitPrice * parseFloat(qty) : 0;
  const unit = lang === "th" ? commodity.unit : commodity.unitEn;

  const handleSubmit = async () => {
    if (!qty || parseFloat(qty) <= 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
    setQty("");
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Buy / Sell */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
        {(["buy", "sell"] as OrderSide[]).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              "py-2 rounded-md text-sm font-bold transition-all font-display",
              side === s
                ? s === "buy"
                  ? "bg-bull text-white shadow-sm"
                  : "bg-bear text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "buy" ? tr.buy : tr.sell}
          </button>
        ))}
      </div>

      {/* Order Type */}
      <div className="flex gap-1">
        {(["market", "limit", "stop"] as OrderType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "flex-1 py-1.5 text-[12px] font-bold rounded-md border transition-all",
              type === t
                ? side === "buy"
                  ? "border-bull/50 bg-bull/10 text-bull"
                  : "border-bear/50 bg-bear/10 text-bear"
                : "border-border text-muted-foreground hover:border-border/80",
            )}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Price (limit/stop) */}
      {type !== "market" && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-[12px] text-muted-foreground uppercase tracking-wider">
            {tr.price} / {unit}
          </Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="h-8 text-sm"
          />
        </div>
      )}

      {/* Qty */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-[12px] text-muted-foreground uppercase tracking-wider">
          {tr.quantity} ({unit})
        </Label>
        <Input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="0.00"
          className="h-8 text-sm"
        />
      </div>

      {/* Quick qty */}
      <div className="grid grid-cols-4 gap-1">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => setQty(String(q))}
            className="py-1 text-[12px] font-semibold rounded-md border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-muted/60 rounded-lg p-2.5 flex justify-between items-center">
        <span className="text-[12px] text-muted-foreground font-medium">
          {tr.amount}
        </span>
        <span
          className={cn(
            "text-base font-bold font-mono",
            side === "buy" ? "text-bull" : "text-bear",
          )}
        >
          ฿{total.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading || !qty}
        variant={done ? "outline" : side === "buy" ? "bull" : "bear"}
        className="w-full h-9 text-sm font-bold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {lang === "th" ? "กำลังส่ง..." : "Submitting..."}
          </span>
        ) : done ? (
          tr.orderSent
        ) : (
          `${side === "buy" ? tr.buy : tr.sell} ${commodity.symbol}`
        )}
      </Button>

      <Separator />
      <div className="flex justify-between">
        <span className="text-[12px] text-muted-foreground">{tr.wallet}</span>
        <span className="text-[11px] font-mono font-semibold text-primary">
          ฿2,450,000
        </span>
      </div>
    </div>
  );
}
