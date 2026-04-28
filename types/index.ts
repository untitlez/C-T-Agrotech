export interface Commodity {
  id: string; name: string; nameEn: string; symbol: string;
  unit: string; unitEn: string; grade: string;
  origin: string; originEn: string; category: string; categoryEn: string;
  basePrice: number;
}
export interface Candle { time: number; open: number; high: number; low: number; close: number; volume: number; }
export interface MarketItem extends Commodity { candles: Candle[]; price: number; change: number; volume: number; high24h: number; low24h: number; }
export interface OrderBookEntry { price: number; qty: number; total: number; }
export interface Trade { id: string; price: number; qty: number; side: "buy"|"sell"; time: string; }
export type OrderType = "market"|"limit"|"stop";
export type OrderSide = "buy"|"sell";
export interface Order { id: string; symbol: string; type: OrderType; side: OrderSide; price: number; qty: number; status: "open"|"filled"|"cancelled"; createdAt: string; }
export interface FuturesContract { id: string; commodityId: string; symbol: string; term: "3M"|"6M"|"12M"; spotPrice: number; futurePrice: number; premium: number; deliveryDate: string; deliveryDateEn: string; openInterest: number; }
export interface Transaction { id: string; type: "deposit"|"withdraw"|"trade"; amount: number; status: "pending"|"completed"|"failed"; method: string; createdAt: string; description: string; }
export interface User { id: string; name: string; email: string; role: "admin"|"trader"|"viewer"; balance: number; verified: boolean; joinedAt: string; }
export type Language = "th"|"en";
