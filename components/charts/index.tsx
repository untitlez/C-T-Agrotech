"use client"
import type { Candle } from "@/types"

/* ─── Sparkline ─────────────────────────────────────────────── */
export function Sparkline({ data, color="#0ABFBC", width=110, height=32 }: { data:Candle[]; color?:string; width?:number; height?:number }) {
  if (!data?.length) return null
  const prices = data.map(d=>d.close)
  const min=Math.min(...prices), max=Math.max(...prices), rng=max-min||1
  const pts=prices.map((p,i)=>`${(i/(prices.length-1))*width},${height-((p-min)/rng)*(height-2)+1}`).join(" ")
  return (
    <svg width={width} height={height} style={{display:"block",overflow:"visible"}}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Candle Chart ───────────────────────────────────────────── */
export function CandleChart({ candles, width=700, height=340 }: { candles:Candle[]; width?:number; height?:number }) {
  if (!candles?.length) return null
  const pad={t:20,r:70,b:24,l:10}
  const iW=width-pad.l-pad.r, iH=height-pad.t-pad.b
  const slice=candles.slice(-48)
  const prices=slice.flatMap(c=>[c.high,c.low])
  const mn=Math.min(...prices), mx=Math.max(...prices), rng=mx-mn||1
  const toY=(p:number)=>pad.t+iH-((p-mn)/rng)*iH
  const gap=iW/slice.length, cw=Math.max(6,gap*0.65)
  const levels=6

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{display:"block"}}>
      {/* Grid */}
      {Array.from({length:levels+1},(_,i)=>{
        const price=mn+(rng/levels)*i, y=toY(price)
        return (
          <g key={i}>
            <line x1={pad.l} x2={width-pad.r} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="3,3"/>
            <text x={width-pad.r+6} y={y+4} fontSize="11" fill="currentColor" fillOpacity="0.45" fontFamily="JetBrains Mono,monospace" fontWeight="500">
              {Math.round(price).toLocaleString("th-TH")}
            </text>
          </g>
        )
      })}
      {/* Candles */}
      {slice.map((c,i)=>{
        const x=pad.l+i*gap+gap/2, up=c.close>=c.open
        const col=up?"oklch(64% 0.18 152)":"oklch(56% 0.24 25)"
        const bTop=toY(Math.max(c.open,c.close))
        const bH=Math.max(1,toY(Math.min(c.open,c.close))-bTop)
        return (
          <g key={i} className="transition-all duration-200 hover:opacity-75">
            <line x1={x} x2={x} y1={toY(c.high)} y2={toY(c.low)} stroke={col} strokeWidth="1.5" opacity="0.65"/>
            <rect x={x-cw/2} y={bTop} width={cw} height={bH} fill={col} opacity="0.85" rx="1.5"/>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Volume Bars ────────────────────────────────────────────── */
export function VolumeBar({ candles, width=700, height=60 }: { candles:Candle[]; width?:number; height?:number }) {
  if (!candles?.length) return null
  const slice=candles.slice(-48)
  const maxV=Math.max(...slice.map(c=>c.volume))
  const gap=(width-70)/slice.length, bw=Math.max(4,gap*0.65)
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{display:"block"}}>
      {slice.map((c,i)=>{
        const x=10+i*gap+gap/2, bh=Math.max(3,(c.volume/maxV)*(height-6)), up=c.close>=c.open
        return <rect key={i} x={x-bw/2} y={height-bh} width={bw} height={bh} fill={up?"oklch(64% 0.18 152)":"oklch(56% 0.24 25)"} opacity="0.35" rx="1.5"/>
      })}
    </svg>
  )
}
