"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label, Separator } from "@/components/ui/primitives"
import { Logo } from "@/components/ui/logo"
import { Switch } from "@/components/ui/shadcn"
import { useLang } from "@/contexts/lang-context"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import { Eye, EyeOff, AlertCircle, Sun, Moon, Globe } from "lucide-react"

export default function SignInPage() {
  const { lang, setLang, tr } = useLang()
  const { signIn } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const [email, setEmail] = useState("akkarawit@gmail.com")
  const [pw, setPw] = useState("password")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const submit = async () => {
    if (!email||!pw) { setErr(lang==="th"?"กรุณากรอกข้อมูลให้ครบ":"Please fill in all fields"); return }
    setLoading(true); setErr("")
    await signIn(email, pw)
    setLoading(false); router.push("/trade")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4">
        <Link href="/trade"><Logo size="sm"/></Link>
        <div className="flex items-center gap-2">
          <Sun className="size-3.5 text-muted-foreground"/>
          <Switch checked={resolvedTheme==="dark"} onCheckedChange={v=>setTheme(v?"dark":"light")} className="scale-90"/>
          <Moon className="size-3.5 text-muted-foreground"/>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={()=>setLang(lang==="th"?"en":"th")}>
            <Globe className="size-3"/>{lang==="th"?"EN":"TH"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[380px]">
          <div className="text-center mb-6">
            <Logo size="lg" variant="icon" className="mx-auto mb-3"/>
            <h1 className="text-2xl font-bold font-display">{tr.signIn}</h1>
            <p className="text-sm text-muted-foreground mt-1">C&T AGROTECH Fertilizer Trading</p>
          </div>

          <Card>
            <CardContent className="pt-5 flex flex-col gap-3.5">
              {err && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="size-4 flex-shrink-0"/>{err}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">{tr.email}</Label>
                <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" onKeyDown={e=>e.key==="Enter"&&submit()}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">{tr.password}</Label>
                  <button className="text-[11px] text-primary hover:underline">{tr.forgotPw}</button>
                </div>
                <div className="relative">
                  <Input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" className="pr-10" onKeyDown={e=>e.key==="Enter"&&submit()}/>
                  <button onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show?<EyeOff className="size-4"/>:<Eye className="size-4"/>}
                  </button>
                </div>
              </div>
              <Button onClick={submit} disabled={loading} className="w-full h-9">
                {loading?<span className="flex items-center gap-2"><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>{lang==="th"?"กำลังเข้าสู่ระบบ...":"Signing in..."}</span>:tr.signIn}
              </Button>

              <Separator/>
              <div>
                <p className="text-[10px] text-muted-foreground text-center mb-2 uppercase tracking-wide">{lang==="th"?"บัญชีทดสอบ":"Demo Accounts"}</p>
                <div className="flex flex-col gap-1.5">
                  {[{e:"somchai@gmail.com",r:"Admin"},{e:"akkarawit@gmail.com",r:"Trader"}].map(d=>(
                    <button key={d.e} onClick={()=>setEmail(d.e)}
                      className="flex justify-between items-center px-3 py-2 rounded-lg border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all text-xs">
                      <span className="font-mono text-muted-foreground">{d.e}</span>
                      <span className="text-[10px] font-semibold text-primary">{d.r}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {tr.noAccount} <Link href="/auth/signup" className="text-primary font-semibold hover:underline">{tr.signUp}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
