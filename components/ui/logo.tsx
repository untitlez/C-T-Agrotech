import { cn } from "@/lib/utils"

interface LogoProps { size?: "xs"|"sm"|"md"|"lg"|"xl"; variant?: "full"|"icon"|"wordmark"; className?: string }

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const s = { xs:20, sm:28, md:36, lg:52, xl:80 }[size]
  const nameSize = { xs:11, sm:14, md:17, lg:24, xl:36 }[size]
  const subSize  = { xs:6,  sm:7,  md:8,  lg:11, xl:15 }[size]

  const Icon = () => (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="47" stroke="#0ABFBC" strokeWidth="3" fill="none"/>
      {/* Sun rays */}
      {Array.from({length:14}).map((_,i)=>{
        const a=(i*25.7-90)*Math.PI/180, r1=28, r2=46
        const x1=50+r1*Math.cos(a), y1=46+r1*Math.sin(a)
        const x2=50+r2*Math.cos(a), y2=46+r2*Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i%2===0?"#f5a623":"#0ABFBC"} strokeWidth="3" strokeLinecap="round"/>
      })}
      {/* Sun */}
      <circle cx="50" cy="46" r="11" fill="#f5a623"/>
      {/* Field lines */}
      {[60,67,73,79].map((cy,i)=>(
        <ellipse key={cy} cx="50" cy={cy} rx={36-i*5} ry="2.5" stroke="#0ABFBC" strokeWidth="2.5" fill="none" opacity={0.9-i*0.15}/>
      ))}
      {/* Wheat left */}
      <path d="M19 34 Q13 20 22 9 Q27 22 21 34" fill="#0ABFBC" opacity="0.9"/>
      <path d="M22 34 Q12 19 22 6 Q29 20 24 34" fill="#0d9e9b" opacity="0.7"/>
      <path d="M25 34 Q17 17 28 5 Q33 18 27 34" fill="#0ABFBC" opacity="0.8"/>
      {/* Wheat right */}
      <path d="M79 30 Q87 18 78 7 Q71 20 77 30" fill="#0ABFBC" opacity="0.8"/>
      <path d="M77 30 Q87 20 81 7 Q73 18 75 30" fill="#0d9e9b" opacity="0.6"/>
    </svg>
  )

  if (variant === "icon") return <Icon/>

  if (variant === "wordmark") return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span style={{fontSize:nameSize,fontFamily:"Prompt,sans-serif",fontWeight:800,color:"#0ABFBC",letterSpacing:"-0.01em"}}>C&T</span>
      <span style={{fontSize:subSize,fontFamily:"Prompt,sans-serif",fontWeight:600,color:"#0d9e9b",letterSpacing:"0.1em"}}>AGROTECH</span>
    </div>
  )

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon/>
      <div className="flex flex-col leading-none">
        <span style={{fontSize:nameSize,fontFamily:"Prompt,sans-serif",fontWeight:800,color:"#0ABFBC",letterSpacing:"-0.01em"}}>C&T</span>
        <span style={{fontSize:subSize,fontFamily:"Prompt,sans-serif",fontWeight:600,color:"#0d9e9b",letterSpacing:"0.1em"}}>AGROTECH</span>
        {(size==="lg"||size==="xl")&&<span style={{fontSize:subSize*0.75,fontFamily:"Prompt,sans-serif",fontWeight:400,color:"#f5a623",letterSpacing:"0.06em"}}>Fertilizer Trading</span>}
      </div>
    </div>
  )
}
