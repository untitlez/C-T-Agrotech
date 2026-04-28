import type { Commodity, Candle, MarketItem, Trade, FuturesContract, Transaction, User, Order } from "@/types";

export const COMMODITIES: Commodity[] = [
  { id:"NPK161616", name:"ปุ๋ย NPK 16-16-16", nameEn:"NPK Fertilizer 16-16-16", symbol:"NPK16", unit:"ตัน", unitEn:"ton", grade:"A", origin:"จีน", originEn:"China", category:"ปุ๋ย", categoryEn:"Fertilizer", basePrice:18500 },
  { id:"UREA46", name:"ปุ๋ยยูเรีย 46%", nameEn:"Urea 46%", symbol:"UREA", unit:"ตัน", unitEn:"ton", grade:"A+", origin:"ซาอุดีอาระเบีย", originEn:"Saudi Arabia", category:"ปุ๋ย", categoryEn:"Fertilizer", basePrice:22000 },
  { id:"NPK152015", name:"ปุ๋ย NPK 15-20-15", nameEn:"NPK Fertilizer 15-20-15", symbol:"NPK15", unit:"ตัน", unitEn:"ton", grade:"A", origin:"รัสเซีย", originEn:"Russia", category:"ปุ๋ย", categoryEn:"Fertilizer", basePrice:19200 },
  { id:"GLYPHO", name:"ไกลโฟเซต 48%", nameEn:"Glyphosate 48%", symbol:"GLY48", unit:"กิโล", unitEn:"kg", grade:"B+", origin:"จีน", originEn:"China", category:"สารเคมี", categoryEn:"Chemical", basePrice:185 },
  { id:"CHLORO", name:"คลอร์ไพริฟอส 40%", nameEn:"Chlorpyrifos 40%", symbol:"CHL40", unit:"ลิตร", unitEn:"liter", grade:"A", origin:"ไทย", originEn:"Thailand", category:"สารเคมี", categoryEn:"Chemical", basePrice:320 },
  { id:"POTASH", name:"โพแทสเซียมคลอไรด์", nameEn:"Potassium Chloride", symbol:"KCL", unit:"ตัน", unitEn:"ton", grade:"A+", origin:"แคนาดา", originEn:"Canada", category:"ปุ๋ย", categoryEn:"Fertilizer", basePrice:16800 },
];

export function generateCandles(base: number, n = 60): Candle[] {
  const arr: Candle[] = []; let p = base; const now = Date.now();
  for (let i = n; i >= 0; i--) {
    const o = p, c = Math.max(base * 0.6, p + (Math.random() - 0.48) * base * 0.025);
    const h = Math.max(o, c) + Math.random() * base * 0.008;
    const l = Math.min(o, c) - Math.random() * base * 0.008;
    arr.push({ time: now - i * 3600000, open: o, high: h, low: l, close: c, volume: Math.floor(Math.random() * 500) + 50 });
    p = c;
  }
  return arr;
}

export function initMarketData(): MarketItem[] {
  return COMMODITIES.map(c => {
    const candles = generateCandles(c.basePrice);
    const last = candles[candles.length - 1], first = candles[0];
    return { ...c, candles, price: last.close, change: ((last.close - first.close) / first.close) * 100, volume: candles.reduce((s, x) => s + x.volume, 0), high24h: Math.max(...candles.map(x => x.high)), low24h: Math.min(...candles.map(x => x.low)) };
  });
}

export function generateOrderBook(mid: number) {
  const bids: { price: number; qty: number; total: number }[] = [];
  const asks: { price: number; qty: number; total: number }[] = [];
  let bp = mid, ap = mid;
  for (let i = 0; i < 12; i++) {
    bp -= Math.random() * mid * 0.002; ap += Math.random() * mid * 0.002;
    bids.push({ price: Math.round(bp), qty: +(Math.random() * 50 + 5).toFixed(2), total: 0 });
    asks.push({ price: Math.round(ap), qty: +(Math.random() * 50 + 5).toFixed(2), total: 0 });
  }
  let bt = 0, at = 0;
  bids.forEach(b => { bt += b.qty; b.total = +bt.toFixed(2); });
  asks.forEach(a => { at += a.qty; a.total = +at.toFixed(2); });
  return { bids, asks };
}

export function generateTrades(mid: number): Trade[] {
  return Array.from({ length: 20 }, () => {
    const side = Math.random() > 0.5 ? "buy" : "sell";
    return { id: `T${Math.random().toString(36).substr(2, 6).toUpperCase()}`, price: Math.round(mid * (1 + (Math.random() - 0.5) * 0.01)), qty: +(Math.random() * 20 + 1).toFixed(2), side: side as "buy" | "sell", time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString("th-TH") };
  });
}

export function generateFutures(market: MarketItem[]): FuturesContract[] {
  const terms: Array<{ term: "3M"|"6M"|"12M"; prem: number; th: string; en: string }> = [
    { term:"3M", prem:.02, th:"มิ.ย. 2568", en:"Jun 2025" },
    { term:"6M", prem:.045, th:"ก.ย. 2568", en:"Sep 2025" },
    { term:"12M", prem:.09, th:"ธ.ค. 2568", en:"Dec 2025" },
  ];
  return market.slice(0, 4).flatMap(item =>
    terms.map(t => ({ id:`${item.id}-${t.term}`, commodityId:item.id, symbol:`${item.symbol}-${t.term}`, term:t.term, spotPrice:item.price, futurePrice:item.price*(1+t.prem), premium:t.prem*100, deliveryDate:t.th, deliveryDateEn:t.en, openInterest:Math.floor(Math.random()*5000)+500 }))
  );
}

export const MOCK_USERS: User[] = [
  { id:"u1", name:"อัครวิชช์ ถาวรพิบูลย์", email:"akkarawit@gmail.com", role:"admin", balance:5000000, verified:true, joinedAt:"2024-01-15" },
  { id:"u2", name:"สมชาย ใจดี", email:"somchai@gmail.com", role:"trader", balance:2450000, verified:true, joinedAt:"2024-03-10" },
  { id:"u3", name:"ธนา วัตถุดิบ", email:"thana@gmail.com", role:"trader", balance:1200000, verified:false, joinedAt:"2024-06-22" },
  { id:"u4", name:"รัตนา พืชผล", email:"rattana@gmail.com", role:"viewer", balance:800000, verified:true, joinedAt:"2024-08-05" },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id:"TX001", type:"deposit", amount:500000, status:"completed", method:"bank_transfer", createdAt:"2025-03-28 09:12", description:"โอนเงินเข้ากระเป๋า" },
  { id:"TX002", type:"trade", amount:-185000, status:"completed", method:"wallet", createdAt:"2025-03-27 14:35", description:"ซื้อ NPK16 10 ตัน" },
  { id:"TX003", type:"trade", amount:220000, status:"completed", method:"wallet", createdAt:"2025-03-26 11:20", description:"ขาย UREA 10 ตัน" },
  { id:"TX004", type:"withdraw", amount:-300000, status:"pending", method:"bank_transfer", createdAt:"2025-03-25 16:45", description:"ถอนเงินออกบัญชี" },
  { id:"TX005", type:"deposit", amount:1000000, status:"completed", method:"promptpay", createdAt:"2025-03-20 10:00", description:"โอนผ่าน PromptPay" },
];

export const MOCK_ORDERS: Order[] = [
  { id:"ORD001", symbol:"NPK16", type:"limit", side:"buy", price:18200, qty:5, status:"open", createdAt:"2025-03-30 08:30" },
  { id:"ORD002", symbol:"UREA", type:"market", side:"sell", price:22100, qty:10, status:"filled", createdAt:"2025-03-29 15:45" },
  { id:"ORD003", symbol:"KCL", type:"stop", side:"sell", price:16500, qty:3, status:"open", createdAt:"2025-03-29 09:00" },
];

export const ADMIN_STATS = { totalUsers:1847, activeTraders:342, totalVolume24h:48750000, totalTransactions:12483, pendingKYC:23, revenue30d:1250000 };

export const MARKET_NEWS = [
  { id:1, title:"ราคาปุ๋ยยูเรียโลก +3.2% หลังรัสเซียลดส่งออก", titleEn:"Global urea prices rise 3.2% as Russia cuts exports", time:"2 ชม.ที่แล้ว", timeEn:"2 hours ago", tag:"ปุ๋ย", tagEn:"Fertilizer", impact:"bullish" as const },
  { id:2, title:"น้ำมัน Brent +1.8% กดดันต้นทุนปุ๋ยไนโตรเจน", titleEn:"Brent crude +1.8% pressures nitrogen fertilizer costs", time:"4 ชม.ที่แล้ว", timeEn:"4 hours ago", tag:"น้ำมัน", tagEn:"Oil", impact:"bearish" as const },
  { id:3, title:"จีนระงับส่งออกสารเคมีเกษตร Q4 ราคาในประเทศพุ่ง", titleEn:"China halts agrochemical exports in Q4 — domestic prices surge", time:"6 ชม.ที่แล้ว", timeEn:"6 hours ago", tag:"สารเคมี", tagEn:"Chemical", impact:"bullish" as const },
  { id:4, title:"กรมวิชาการเกษตรออกมาตรฐานใหม่ NPK", titleEn:"Agriculture Dept issues new NPK standards", time:"1 วัน", timeEn:"1 day ago", tag:"กฎหมาย", tagEn:"Regulation", impact:"neutral" as const },
  { id:5, title:"KCL จากแคนาดาขาดแคลน ราคาพุ่ง 5%", titleEn:"Canadian potash shortage — KCL surges 5%", time:"1 วัน", timeEn:"1 day ago", tag:"ปุ๋ย", tagEn:"Fertilizer", impact:"bullish" as const },
];
