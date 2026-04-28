"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/primitives"
import { ScrollArea } from "@/components/ui/shadcn"
import { useLang } from "@/contexts/lang-context"
import { useMarket } from "@/contexts/market-context"
import { ADMIN_STATS, MOCK_USERS, MOCK_TRANSACTIONS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { fmtPct } from "@/lib/utils"
import {
  Users, Activity, BarChart3, DollarSign, AlertCircle,
  TrendingUp, Search, ShieldCheck, ShieldX
} from "lucide-react"

export default function DashboardPage() {
  const { lang, tr } = useLang()
  const { market } = useMarket()
  const [search, setSearch] = useState("")
  const [verified, setVerified] = useState<Set<string>>(new Set())

  const filteredUsers = MOCK_USERS.filter(u =>
    !search || (u.name + u.email).toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { l: tr.totalUsers,   v: ADMIN_STATS.totalUsers.toLocaleString(),     icon: <Users className="size-4"/>,      c: "text-primary",     bg: "bg-primary/10" },
    { l: tr.activeTraders,v: ADMIN_STATS.activeTraders.toLocaleString(),  icon: <Activity className="size-4"/>,   c: "text-bull",        bg: "bg-bull/10" },
    { l: tr.totalVolume,  v: `฿${(ADMIN_STATS.totalVolume24h/1e6).toFixed(1)}M`, icon: <BarChart3 className="size-4"/>, c: "text-primary", bg: "bg-primary/10" },
    { l: tr.totalTx,      v: ADMIN_STATS.totalTransactions.toLocaleString(), icon: <DollarSign className="size-4"/>, c: "text-amber-500", bg: "bg-amber-500/10" },
    { l: tr.pendingKYC,   v: ADMIN_STATS.pendingKYC.toString(),           icon: <AlertCircle className="size-4"/>, c: "text-bear",       bg: "bg-bear/10" },
    { l: tr.revenue,      v: `฿${(ADMIN_STATS.revenue30d/1e6).toFixed(2)}M`, icon: <TrendingUp className="size-4"/>, c: "text-primary",  bg: "bg-primary/10" },
  ]

  const roleBadge: Record<string, "default"|"secondary"|"muted"> = {
    admin: "default", trader: "secondary", viewer: "muted",
  }

  const SYS = [
    { name: "Trading Engine",    ok: true  },
    { name: "Matching Engine",   ok: true  },
    { name: "Payment Gateway",   ok: true  },
    { name: "Market Data Feed",  ok: true  },
    { name: "KYC Service",       ok: false },
  ]

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar/>
      <TickerBar/>
      <main className="flex-1 p-4 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold font-display">{tr.adminDashboard}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang==="th"?"ภาพรวมระบบและการจัดการผู้ใช้":"System overview and user management"}
            </p>
          </div>
          <Badge variant="tiffany" className="gap-1.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse"/>
            {tr.systemOnline}
          </Badge>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-6 gap-3 mb-5">
          {stats.map(s => (
            <Card key={s.l} className="hover:shadow-sm transition-all gap-2 py-4">
              <CardContent className="px-4">
                <div className={cn("size-8 rounded-lg flex items-center justify-center mb-2", s.bg, s.c)}>
                  {s.icon}
                </div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">{s.l}</p>
                <p className={cn("text-xl font-bold font-mono", s.c)}>{s.v}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left: Users + Transactions */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Users */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3 flex-row items-center justify-between space-y-0">
                <CardTitle>{tr.userMgmt}</CardTitle>
                <div className="relative w-44">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"/>
                  <Input value={search} onChange={e=>setSearch(e.target.value)}
                    placeholder={lang==="th"?"ค้นหาผู้ใช้...":"Search users..."}
                    className="h-7 pl-7 text-xs"/>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {[tr.fullName, tr.email, tr.role, tr.balance, lang==="th"?"ยืนยัน":"Status", tr.joinDate, ""].map(h=>(
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u=>(
                      <tr key={u.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {u.name[0]}
                            </div>
                            <span className="text-sm font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={roleBadge[u.role]} className="text-[11px]">{u.role}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          ฿{u.balance.toLocaleString("th-TH")}
                        </td>
                        <td className="px-4 py-3">
                          {u.verified
                            ? <span className="flex items-center gap-1 text-bull text-[12px] font-semibold"><ShieldCheck className="size-3.5"/>{tr.verified}</span>
                            : <span className="flex items-center gap-1 text-bear text-[12px] font-semibold"><ShieldX className="size-3.5"/>{lang==="th"?"ยังไม่ยืนยัน":"Unverified"}</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.joinedAt}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost" className="h-6 text-[12px] px-2">
                            {lang==="th"?"จัดการ":"Manage"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle>{lang==="th"?"ธุรกรรมล่าสุด":"Recent Transactions"}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {["ID", lang==="th"?"รายละเอียด":"Description", lang==="th"?"จำนวน":"Amount", lang==="th"?"วิธี":"Method", tr.status, lang==="th"?"วันที่":"Date"].map(h=>(
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TRANSACTIONS.map(tx=>(
                      <tr key={tx.id} className="border-b border-border/40 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{tx.id}</td>
                        <td className="px-4 py-2.5 text-xs">{tx.description}</td>
                        <td className={cn("px-4 py-2.5 font-mono text-xs font-semibold", tx.amount>0?"text-bull":"text-bear")}>
                          {tx.amount>0?"+":""}฿{Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-[12px] text-muted-foreground capitalize">
                          {tx.method.replace("_"," ")}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant={tx.status==="completed"?"bull":tx.status==="pending"?"gold":"bear"} className="text-[11px]">
                            {lang==="th"
                              ? tx.status==="completed"?"สำเร็จ":tx.status==="pending"?"รอดำเนินการ":"ล้มเหลว"
                              : tx.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-[12px] text-muted-foreground">{tx.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-4">
            {/* Market Summary */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle>{lang==="th"?"สรุปตลาด":"Market Summary"}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {market.map(item=>{
                  const isUp = item.change>=0
                  return (
                    <div key={item.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-mono font-bold text-xs text-primary">{item.symbol}</span>
                        <span className="text-[11px] text-muted-foreground ml-1.5">{lang==="th"?item.category:item.categoryEn}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-semibold">
                          ฿{item.price.toLocaleString("th-TH",{maximumFractionDigits:0})}
                        </div>
                        <div className={cn("text-[12px] font-mono", isUp?"text-bull":"text-bear")}>
                          {isUp?"▲":"▼"} {Math.abs(item.change).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Pending KYC */}
            <Card className="gap-0 py-0 border-bear/20">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle className="flex items-center gap-1.5 text-bear">
                  <AlertCircle className="size-3.5"/>{tr.pendingKYC}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 flex flex-col gap-2">
                {MOCK_USERS.filter(u=>!u.verified).map(u=>{
                  const isVerified = verified.has(u.id)
                  return (
                    <div key={u.id} className={cn("flex items-center justify-between p-2.5 rounded-lg border transition-all",
                      isVerified?"border-bull/20 bg-bull/5":"border-bear/20 bg-bear/5")}>
                      <div className="flex items-center gap-2">
                        <div className={cn("size-7 rounded-full flex items-center justify-center text-[11px] font-bold",
                          isVerified?"bg-bull/20 text-bull":"bg-bear/20 text-bear")}>
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{u.name}</p>
                          <p className="text-[12px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <Button size="sm" variant={isVerified?"outline":"default"}
                        className={cn("h-6 text-[12px] px-2", isVerified&&"text-bull border-bull/40")}
                        disabled={isVerified}
                        onClick={()=>setVerified(prev=>new Set([...prev,u.id]))}>
                        {isVerified?`✓ ${lang==="th"?"ยืนยัน":"Verified"}`:lang==="th"?"ยืนยัน":"Verify"}
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle>{tr.systemStatus}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {SYS.map(s=>(
                  <div key={s.name} className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 last:border-0">
                    <span className="text-xs">{s.name}</span>
                    <div className={cn("flex items-center gap-1.5 text-[12px] font-semibold", s.ok?"text-bull":"text-bear")}>
                      <span className={cn("size-2 rounded-full", s.ok?"bg-bull animate-pulse":"bg-bear")}/>
                      {s.ok?(lang==="th"?"ปกติ":"Online"):(lang==="th"?"ขัดข้อง":"Issue")}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
