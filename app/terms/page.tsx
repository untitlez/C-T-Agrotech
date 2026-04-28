"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLang } from "@/contexts/lang-context"
import { cn } from "@/lib/utils"
import { Shield, AlertTriangle, BookOpen, Scale, TrendingDown, FileCheck, ChevronDown } from "lucide-react"

const SECTIONS_TH=[
  { id:"general", icon:<BookOpen className="size-4"/>, title:"ข้อกำหนดทั่วไป", items:["แพลตฟอร์ม C&T AGROTECH เป็นตลาดกลางสำหรับการซื้อขายสินค้าเกษตรและปุ๋ย ผู้ใช้ต้องอายุไม่ต่ำกว่า 18 ปีและผ่านการยืนยันตัวตน (KYC)","บริษัทขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขการให้บริการ โดยแจ้งล่วงหน้าอย่างน้อย 30 วัน","ผู้ใช้ต้องรับผิดชอบรักษาความลับของข้อมูลบัญชีและรหัสผ่าน"] },
  { id:"trading", icon:<Scale className="size-4"/>, title:"กฎการซื้อขาย", items:["การซื้อขาย Spot สมบูรณ์เมื่อ Matching Engine จับคู่สำเร็จ ไม่สามารถยกเลิกได้","Limit Order เก็บไว้ไม่เกิน 30 วัน หากไม่มีการจับคู่จะถูกยกเลิกอัตโนมัติ","ค่าธรรมเนียม 0.1% ต่อธุรกรรม สำหรับ Futures มีค่าธรรมเนียมเพิ่ม 0.05%","ผู้ขายต้องรับรองสินค้าตรง Specification หากไม่เป็นไปตามนั้นถือว่าผิดสัญญา"] },
  { id:"risk", icon:<AlertTriangle className="size-4"/>, title:"การบริหารความเสี่ยง", items:["ราคาสินค้าเกษตรมีความผันผวนสูง ขึ้นอยู่กับสภาพอากาศ นโยบายการค้า และราคาน้ำมัน","ควรลงทุนเฉพาะเงินที่สามารถรับความเสี่ยงได้ ไม่ควรใช้เงินกู้","แนะนำกระจายความเสี่ยง ไม่ลงทุนในสินค้าใดมากเกินไป","ผลการดำเนินงานในอดีตไม่ใช่การรับประกันอนาคต"] },
  { id:"margin", icon:<TrendingDown className="size-4"/>, title:"Margin & Stop Loss", items:["Futures ต้องวาง Margin ขั้นต่ำ 10% ของมูลค่าสัญญา","Margin ต่ำกว่า 7% → ระบบส่ง Margin Call แจ้งเตือน","Margin ต่ำกว่า 5% → ระบบ Force Close Position อัตโนมัติ","แนะนำตั้ง Stop Loss ทุกครั้งที่เปิดสถานะ"] },
  { id:"kyc", icon:<FileCheck className="size-4"/>, title:"KYC & Compliance", items:["ต้องผ่าน KYC โดยส่งบัตรประชาชนหรือหนังสือเดินทางและเอกสารยืนยันที่อยู่","นิติบุคคลต้องแนบหนังสือรับรองบริษัทและเอกสารผู้มีอำนาจลงนาม","มีนโยบาย AML อย่างเคร่งครัด ธุรกรรมน่าสงสัยจะถูกรายงานหน่วยงานที่เกี่ยวข้อง"] },
  { id:"dispute", icon:<Shield className="size-4"/>, title:"การระงับข้อพิพาท", items:["บริษัทเป็นตัวกลางไกล่เกลี่ยหากเกิดข้อพิพาท","Escrow กักเงินจนกว่าทั้งสองฝ่ายยืนยันการส่งมอบสินค้า","หากตกลงไม่ได้ใน 14 วัน นำสู่กระบวนการอนุญาโตตุลาการตามกฎหมายไทย"] },
]
const SECTIONS_EN=[
  { id:"general", icon:<BookOpen className="size-4"/>, title:"General Terms", items:["C&T AGROTECH is an agricultural marketplace. Users must be 18+ and complete KYC before transacting.","The company may update terms with 30 days prior notice.","Users are responsible for maintaining account credential confidentiality."] },
  { id:"trading", icon:<Scale className="size-4"/>, title:"Trading Rules", items:["Spot trades are final when matched by the Matching Engine and cannot be cancelled.","Limit orders expire after 30 days if unmatched.","Trading fee: 0.1% per transaction; Futures: additional 0.05%.","Sellers must guarantee goods match the listed specifications."] },
  { id:"risk", icon:<AlertTriangle className="size-4"/>, title:"Risk Management", items:["Agricultural prices are highly volatile due to weather, trade policy, and oil prices.","Only invest funds you can afford to lose — never use borrowed funds.","Diversify across commodities to reduce concentration risk.","Past performance does not guarantee future results."] },
  { id:"margin", icon:<TrendingDown className="size-4"/>, title:"Margin & Stop Loss", items:["Futures require a minimum 10% margin of the contract value.","Below 7% margin → Margin Call alert issued.","Below 5% margin → System auto-executes Force Close.","Always set a Stop Loss when opening positions."] },
  { id:"kyc", icon:<FileCheck className="size-4"/>, title:"KYC & Compliance", items:["Complete KYC by submitting national ID or passport and proof of address.","Legal entities must provide company registration and authorized signatory documents.","Strict AML policy in force — suspicious transactions will be reported to authorities."] },
  { id:"dispute", icon:<Shield className="size-4"/>, title:"Dispute Resolution", items:["The company acts as mediator in buyer-seller disputes.","Escrow holds funds until both parties confirm delivery.","If unresolved within 14 days, the matter proceeds to arbitration under Thai law."] },
]

export default function TermsPage() {
  const { lang, tr } = useLang()
  const sections = lang==="th" ? SECTIONS_TH : SECTIONS_EN
  const [open, setOpen] = useState<string[]>(["general"])
  const toggle=(id:string)=>setOpen(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar/>
      <TickerBar/>
      <div className="gradient-brand text-white py-12 px-4 text-center">
        <Shield className="size-10 mx-auto mb-3 text-white/80"/>
        <h1 className="text-2xl font-bold font-display mb-2">{tr.termsTitle}</h1>
        <p className="text-white/70 text-sm">{tr.termsDesc}</p>
        <p className="text-white/45 text-[10px] mt-1">{lang==="th"?"อัพเดท: 1 มีนาคม 2568":"Last updated: March 1, 2025"}</p>
      </div>

      <main className="flex-1 max-w-[820px] mx-auto w-full px-4 py-6">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 mb-5">
          <AlertTriangle className="size-5 text-amber-500 flex-shrink-0 mt-0.5"/>
          <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
            {lang==="th"?"การลงทุนในสินค้าเกษตรมีความเสี่ยง ราคาอาจเปลี่ยนแปลงได้ กรุณาศึกษาก่อนลงทุน":"Agricultural commodity investing involves risk. Prices may fluctuate. Please study carefully before investing."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {sections.map(s=>{
            const isOpen=open.includes(s.id)
            return (
              <Card key={s.id} className={cn("overflow-hidden gap-0 py-0 transition-all", isOpen&&"border-primary/20 shadow-sm")}>
                <button onClick={()=>toggle(s.id)} className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", isOpen?"bg-primary/10 text-primary":"bg-muted text-muted-foreground")}>{s.icon}</div>
                    <span className="font-semibold text-sm font-display">{s.title}</span>
                  </div>
                  <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen&&"rotate-180")}/>
                </button>
                {isOpen && (
                  <CardContent className="pb-4 pt-0 border-t border-border/40">
                    <ul className="flex flex-col gap-2.5 pt-3">
                      {s.items.map((item,i)=>(
                        <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                          <span className="size-5 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        <div className="mt-5 p-4 rounded-xl border bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {lang==="th"?"การใช้บริการ C&T AGROTECH ถือว่าคุณยอมรับข้อกำหนดทั้งหมดข้างต้น":"By using C&T AGROTECH, you agree to all terms and conditions above."}
          </p>
          <Button variant={accepted?"outline":"default"} onClick={()=>setAccepted(true)} disabled={accepted}>
            {accepted?`✓ ${lang==="th"?"ยอมรับแล้ว":"Accepted"}`:lang==="th"?"ยอมรับข้อกำหนด":"Accept Terms"}
          </Button>
        </div>
      </main>
    </div>
  )
}
