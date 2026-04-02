"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { initMarketData } from "@/lib/mock-data";
import type { MarketItem } from "@/types";

interface MarketCtx { market: MarketItem[]; selectedId: string; setSelectedId: (id: string) => void; selected: MarketItem | undefined; }
const Ctx = createContext<MarketCtx>({ market: [], selectedId: "", setSelectedId: () => {}, selected: undefined });

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarket] = useState<MarketItem[]>(initMarketData);
  const [selectedId, setSelectedId] = useState("NPK161616");

  useEffect(() => {
    const t = setInterval(() => {
      setMarket(prev => prev.map(item => {
        const delta = (Math.random() - 0.48) * item.price * 0.003;
        const np = Math.max(item.basePrice * 0.5, item.price + delta);
        const lc = item.candles[item.candles.length - 1];
        return { ...item, price: np, change: item.change + (Math.random() - 0.5) * 0.05, candles: [...item.candles.slice(-59), { ...lc, close: np, high: Math.max(lc.high, np), low: Math.min(lc.low, np) }] };
      }));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return <Ctx.Provider value={{ market, selectedId, setSelectedId, selected: market.find(m => m.id === selectedId) }}>{children}</Ctx.Provider>;
}

export const useMarket = () => useContext(Ctx);
