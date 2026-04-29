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
  { id:"TX001", type:"deposit", amount:200, status:"completed", method:"scb", createdAt:"10/04/2026 19:00", description:"ฝากเงิน - SCB" },
  { id:"TX002", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"10/04/2026 19:04", description:"ฝากเงิน - KBANK" },
  { id:"TX003", type:"deposit", amount:300, status:"completed", method:"scb", createdAt:"10/04/2026 19:08", description:"ฝากเงิน - SCB" },
  { id:"TX004", type:"deposit", amount:6000, status:"completed", method:"scb", createdAt:"10/04/2026 19:15", description:"ฝากเงิน - SCB" },
  { id:"TX005", type:"deposit", amount:190, status:"completed", method:"scb", createdAt:"10/04/2026 19:17", description:"ฝากเงิน - SCB" },
  { id:"TX006", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"10/04/2026 19:35", description:"ฝากเงิน - KBANK" },
  { id:"TX007", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"12/04/2026 17:31", description:"ฝากเงิน - KBANK" },
  { id:"TX008", type:"deposit", amount:100, status:"completed", method:"gsb", createdAt:"12/04/2026 17:34", description:"ฝากเงิน - GSB" },
  { id:"TX009", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"12/04/2026 18:27", description:"ฝากเงิน - KBANK" },
  { id:"TX010", type:"deposit", amount:100, status:"completed", method:"gsb", createdAt:"12/04/2026 18:38", description:"ฝากเงิน - GSB" },
  { id:"TX011", type:"withdraw", amount:-5, status:"pending", method:"ktb", createdAt:"12/04/2026 19:38", description:"ถอนเงิน - KTB" },
  { id:"TX012", type:"withdraw", amount:-10000, status:"failed", method:"ktb", createdAt:"12/04/2026 19:38", description:"ถอนเงิน - KTB" },
  { id:"TX013", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"12/04/2026 19:53", description:"ฝากเงิน - KBANK" },
  { id:"TX014", type:"deposit", amount:100, status:"completed", method:"ktb", createdAt:"12/04/2026 20:39", description:"ฝากเงิน - KTB" },
  { id:"TX015", type:"deposit", amount:105, status:"completed", method:"ktb", createdAt:"12/04/2026 21:29", description:"ฝากเงิน - KTB" },
  { id:"TX016", type:"deposit", amount:4000, status:"completed", method:"bay", createdAt:"13/04/2026 19:45", description:"ฝากเงิน - BAY" },
  { id:"TX017", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"13/04/2026 19:45", description:"ฝากเงิน - KBANK" },
  { id:"TX018", type:"deposit", amount:40, status:"completed", method:"kkp", createdAt:"13/04/2026 19:45", description:"ฝากเงิน - KKP" },
  { id:"TX019", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"13/04/2026 19:49", description:"ฝากเงิน - KBANK" },
  { id:"TX020", type:"deposit", amount:100, status:"completed", method:"bay", createdAt:"13/04/2026 19:58", description:"ฝากเงิน - BAY" },
  { id:"TX021", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"13/04/2026 20:12", description:"ฝากเงิน - KBANK" },
  { id:"TX022", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"13/04/2026 21:10", description:"ฝากเงิน - KBANK" },
  { id:"TX023", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"13/04/2026 21:20", description:"ฝากเงิน - KBANK" },
  { id:"TX024", type:"withdraw", amount:-5, status:"pending", method:"gsb", createdAt:"14/04/2026 19:43", description:"ถอนเงิน - GSB" },
  { id:"TX025", type:"deposit", amount:191, status:"completed", method:"gsb", createdAt:"14/04/2026 20:10", description:"ฝากเงิน - GSB" },
  { id:"TX026", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"14/04/2026 20:28", description:"ฝากเงิน - KBANK" },
  { id:"TX027", type:"deposit", amount:75, status:"completed", method:"kbank", createdAt:"14/04/2026 21:23", description:"ฝากเงิน - KBANK" },
  { id:"TX028", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"14/04/2026 21:24", description:"ฝากเงิน - KBANK" },
  { id:"TX029", type:"deposit", amount:80, status:"completed", method:"kbank", createdAt:"14/04/2026 21:36", description:"ฝากเงิน - KBANK" },
  { id:"TX030", type:"deposit", amount:50, status:"completed", method:"kbank", createdAt:"14/04/2026 22:06", description:"ฝากเงิน - KBANK" },
  { id:"TX031", type:"deposit", amount:200, status:"completed", method:"kbank", createdAt:"14/04/2026 22:19", description:"ฝากเงิน - KBANK" },
  { id:"TX032", type:"deposit", amount:400, status:"completed", method:"kbank", createdAt:"15/04/2026 19:47", description:"ฝากเงิน - KBANK" },
  { id:"TX033", type:"deposit", amount:100, status:"completed", method:"scb", createdAt:"15/04/2026 19:47", description:"ฝากเงิน - SCB" },
  { id:"TX034", type:"deposit", amount:40, status:"completed", method:"kbank", createdAt:"15/04/2026 19:47", description:"ฝากเงิน - KBANK" },
  { id:"TX035", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"15/04/2026 19:47", description:"ฝากเงิน - KBANK" },
  { id:"TX036", type:"deposit", amount:100, status:"completed", method:"ktb", createdAt:"15/04/2026 19:48", description:"ฝากเงิน - KTB" },
  { id:"TX037", type:"deposit", amount:300, status:"completed", method:"baac", createdAt:"15/04/2026 19:48", description:"ฝากเงิน - BAAC" },
  { id:"TX038", type:"deposit", amount:200, status:"completed", method:"kbank", createdAt:"15/04/2026 19:48", description:"ฝากเงิน - KBANK" },
  { id:"TX039", type:"deposit", amount:350, status:"completed", method:"ktb", createdAt:"15/04/2026 19:49", description:"ฝากเงิน - KTB" },
  { id:"TX040", type:"withdraw", amount:-22000, status:"failed", method:"bbl", createdAt:"15/04/2026 19:50", description:"ถอนเงิน - BBL" },
  { id:"TX041", type:"withdraw", amount:-5, status:"pending", method:"bbl", createdAt:"15/04/2026 19:50", description:"ถอนเงิน - BBL" },
  { id:"TX042", type:"deposit", amount:200, status:"completed", method:"ktb", createdAt:"16/04/2026 20:38", description:"ฝากเงิน - KTB" },
  { id:"TX043", type:"deposit", amount:100, status:"completed", method:"gsb", createdAt:"16/04/2026 20:38", description:"ฝากเงิน - GSB" },
  { id:"TX044", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"16/04/2026 20:38", description:"ฝากเงิน - KBANK" },
  { id:"TX045", type:"withdraw", amount:-5, status:"pending", method:"bbl", createdAt:"16/04/2026 20:39", description:"ถอนเงิน - BBL" },
  { id:"TX046", type:"withdraw", amount:-10000, status:"failed", method:"bbl", createdAt:"16/04/2026 20:39", description:"ถอนเงิน - BBL" },
  { id:"TX047", type:"deposit", amount:100, status:"completed", method:"scb", createdAt:"16/04/2026 20:39", description:"ฝากเงิน - SCB" },
  { id:"TX048", type:"deposit", amount:150, status:"completed", method:"kbank", createdAt:"16/04/2026 20:40", description:"ฝากเงิน - KBANK" },
  { id:"TX049", type:"deposit", amount:100, status:"completed", method:"baac", createdAt:"16/04/2026 20:44", description:"ฝากเงิน - BAAC" },
  { id:"TX050", type:"deposit", amount:60, status:"completed", method:"kbank", createdAt:"16/04/2026 20:57", description:"ฝากเงิน - KBANK" },
  { id:"TX051", type:"deposit", amount:500, status:"completed", method:"kbank", createdAt:"17/04/2026 21:03", description:"ฝากเงิน - KBANK" },
  { id:"TX052", type:"deposit", amount:500, status:"completed", method:"ktb", createdAt:"17/04/2026 21:03", description:"ฝากเงิน - KTB" },
  { id:"TX053", type:"deposit", amount:1500, status:"completed", method:"scb", createdAt:"17/04/2026 21:05", description:"ฝากเงิน - SCB" },
  { id:"TX054", type:"deposit", amount:200, status:"completed", method:"gsb", createdAt:"17/04/2026 21:33", description:"ฝากเงิน - GSB" },
  { id:"TX055", type:"deposit", amount:110, status:"completed", method:"gsb", createdAt:"17/04/2026 22:29", description:"ฝากเงิน - GSB" },
  { id:"TX056", type:"deposit", amount:150, status:"completed", method:"gsb", createdAt:"18/04/2026 20:05", description:"ฝากเงิน - GSB" },
  { id:"TX057", type:"deposit", amount:100, status:"completed", method:"kbank", createdAt:"18/04/2026 20:06", description:"ฝากเงิน - KBANK" },
  { id:"TX058", type:"deposit", amount:100, status:"completed", method:"ktb", createdAt:"18/04/2026 20:06", description:"ฝากเงิน - KTB" },
  { id:"TX059", type:"deposit", amount:103, status:"completed", method:"gsb", createdAt:"18/04/2026 20:06", description:"ฝากเงิน - GSB" },
  { id:"TX060", type:"deposit", amount:200, status:"completed", method:"kbank", createdAt:"18/04/2026 20:06", description:"ฝากเงิน - KBANK" },
  { id:"TX061", type:"deposit", amount:100, status:"completed", method:"bay", createdAt:"18/04/2026 20:06", description:"ฝากเงิน - BAY" },
  { id:"TX062", type:"deposit", amount:500, status:"completed", method:"baykbank", createdAt:"18/04/2026 20:07", description:"ฝากเงิน - BAYKBANK" },
  { id:"TX063", type:"withdraw", amount:-5, status:"pending", method:"gsb", createdAt:"18/04/2026 20:07", description:"ถอนเงิน - GSB" },
  { id:"TX064", type:"withdraw", amount:-25000, status:"failed", method:"gsb", createdAt:"18/04/2026 20:07", description:"ถอนเงิน - GSB" },
  { id:"TX065", type:"deposit", amount:110, status:"completed", method:"gsb", createdAt:"18/04/2026 20:08", description:"ฝากเงิน - GSB" },
  { id:"TX066", type:"deposit", amount:100, status:"completed", method:"ktb", createdAt:"18/04/2026 20:08", description:"ฝากเงิน - KTB" },
  { id:"TX067", type:"deposit", amount:750, status:"completed", method:"scb", createdAt:"18/04/2026 20:12", description:"ฝากเงิน - SCB" },
  { id:"TX068", type:"deposit", amount:250, status:"completed", method:"scb", createdAt:"18/04/2026 20:24", description:"ฝากเงิน - SCB" },
  { id:"TX069", type:"deposit", amount:950, status:"completed", method:"kbank", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - KBANK" },
  { id:"TX070", type:"deposit", amount:300, status:"completed", method:"kbank", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - KBANK" },
  { id:"TX071", type:"deposit", amount:1000, status:"completed", method:"ktb", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - KTB" },
  { id:"TX072", type:"deposit", amount:200, status:"completed", method:"ktb", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - KTB" },
  { id:"TX073", type:"deposit", amount:300, status:"completed", method:"kbank", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - KBANK" },
  { id:"TX074", type:"deposit", amount:100, status:"completed", method:"ttb", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - TTB" },
  { id:"TX075", type:"deposit", amount:1100, status:"completed", method:"bbl", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - BBL" },
  { id:"TX076", type:"deposit", amount:100, status:"completed", method:"scb", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - SCB" },
  { id:"TX077", type:"deposit", amount:100, status:"completed", method:"scb", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - SCB" },
  { id:"TX078", type:"deposit", amount:187, status:"completed", method:"baac", createdAt:"19/04/2026 21:29", description:"ฝากเงิน - BAAC" },
  { id:"TX079", type:"deposit", amount:200, status:"completed", method:"ttb", createdAt:"19/04/2026 21:30", description:"ฝากเงิน - TTB" },
  { id:"TX080", type:"deposit", amount:100, status:"completed", method:"ktb", createdAt:"19/04/2026 21:30", description:"ฝากเงิน - KTB" },
  { id:"TX081", type:"deposit", amount:200, status:"completed", method:"ktb", createdAt:"19/04/2026 21:32", description:"ฝากเงิน - KTB" },
  { id:"TX082", type:"withdraw", amount:-12000, status:"failed", method:"gsb", createdAt:"19/04/2026 21:49", description:"ถอนเงิน - GSB" },
  { id:"TX083", type:"withdraw", amount:-5, status:"pending", method:"gsb", createdAt:"19/04/2026 21:49", description:"ถอนเงิน - GSB" },
  { id:"TX084", type:"deposit", amount:100, status:"completed", method:"gsb", createdAt:"21/04/2026 21:44", description:"ฝากเงิน - GSB" },
  { id:"TX085", type:"deposit", amount:300, status:"completed", method:"scb", createdAt:"21/04/2026 22:07", description:"ฝากเงิน - SCB" },
  { id:"TX086", type:"deposit", amount:300, status:"completed", method:"ktb", createdAt:"21/04/2026 22:10", description:"ฝากเงิน - KTB" },
  { id:"TX087", type:"withdraw", amount:-39000, status:"failed", method:"gsb", createdAt:"21/04/2026 22:18", description:"ถอนเงิน - GSB" },
  { id:"TX088", type:"withdraw", amount:-5, status:"pending", method:"gsb", createdAt:"21/04/2026 22:18", description:"ถอนเงิน - GSB" },
  { id:"TX089", type:"deposit", amount:200, status:"completed", method:"scb", createdAt:"21/04/2026 22:18", description:"ฝากเงิน - SCB" },
  { id:"TX090", type:"deposit", amount:200, status:"completed", method:"scb", createdAt:"21/04/2026 22:57", description:"ฝากเงิน - SCB" },
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
