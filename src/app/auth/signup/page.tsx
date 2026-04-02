"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/primitives"
import { Logo } from "@/components/ui/logo"
import { Switch } from "@/components/ui/shadcn"
import { useLang } from "@/contexts/lang-context"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import { Eye, EyeOff, CheckCircle2, Sun, Moon, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const PW_RULES=[
  { test:(p:string)=>p.length>=8, th:"อย่างน้อย 8 ตัวอักษร", en:"At least 8 characters" },
  { test:(p:string)=>/[A-Z]/.test(p), th:"มีตัวพิมพ์ใหญ่", en:"Contains uppercase" },
  { test:(p:string)=>/[0-9]/.test(p), th:"มีตัวเลข", en:"Contains number" },
]

export default function SignUpPage() {
  const { lang, setLang, tr } = useLang()
  const { signUp } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const [form, setForm] = useState({ name:"", email:"", phone:"", pw:"", confirm:"" })
  const [show, setShow] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const f=(k:keyof typeof form)=>(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,[k]:e.target.value})

  const submit = async () => {
    if (!form.name||!form.email||!form.pw||form.pw!==form.confirm||!agreed) return
    setLoading(true); await signUp(form.name, form.email, form.pw)
    setLoading(false); setSuccess(true); setTimeout(()=>router.push("/trade"),1500)
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center"><CheckCircle2 className="size-16 text-bull mx-auto mb-4"/>
        <h2 className="text-2xl font-bold font-display mb-2">{lang==="th"?"สมัครสำเร็จ!":"Registration Successful!"}</h2>
        <p className="text-muted-foreground text-sm">{lang==="th"?"กำลังพาคุณไปยังหน้าเทรด...":"Redirecting to trade..."}</p>
      </div>
    </div>
  )

  const pwOk = PW_RULES.map(r=>({...r, ok:r.test(form.pw)}))
  const match = form.confirm && form.pw===form.confirm

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

      <div className="flex-1 flex items-center justify-center p-4 py-6">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-5">
            <Logo size="md" variant="icon" className="mx-auto mb-2"/>
            <h1 className="text-2xl font-bold font-display">{tr.signUp}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">C&T AGROTECH Fertilizer Trading</p>
          </div>

          <Card>
            <CardContent className="pt-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">{tr.fullName} *</Label>
                <Input value={form.name} onChange={f("name")} placeholder={lang==="th"?"สมชาย ใจดี":"John Doe"}/>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5"><Label className="text-xs">{tr.email} *</Label><Input type="email" value={form.email} onChange={f("email")} placeholder="email@example.com"/></div>
                <div className="flex flex-col gap-1.5"><Label className="text-xs">{tr.phone}</Label><Input type="tel" value={form.phone} onChange={f("phone")} placeholder="08x-xxx-xxxx"/></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">{tr.password} *</Label>
                <div className="relative">
                  <Input type={show?"text":"password"} value={form.pw} onChange={f("pw")} placeholder="••••••••" className="pr-10"/>
                  <button onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show?<EyeOff className="size-4"/>:<Eye className="size-4"/>}
                  </button>
                </div>
                {form.pw && <div className="flex flex-col gap-0.5">{pwOk.map((r,i)=>(
                  <div key={i} className={cn("flex items-center gap-1.5 text-[10px]", r.ok?"text-bull":"text-muted-foreground")}>
                    <div className={cn("size-1.5 rounded-full",r.ok?"bg-bull":"bg-muted-foreground/40")}/>
                    {lang==="th"?r.th:r.en}
                  </div>
                ))}</div>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">{tr.confirmPassword} *</Label>
                <Input type="password" value={form.confirm} onChange={f("confirm")} placeholder="••••••••"
                  className={cn(form.confirm&&(match?"border-bull":"border-bear"))}/>
                {form.confirm&&!match&&<p className="text-[10px] text-bear">{lang==="th"?"รหัสผ่านไม่ตรงกัน":"Passwords do not match"}</p>}
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <div onClick={()=>setAgreed(!agreed)}
                  className={cn("size-4 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all cursor-pointer",
                    agreed?"bg-primary border-primary":"border-border hover:border-primary/50"
                  )}>
                  {agreed&&<svg className="size-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {lang==="th"?"ฉันยอมรับ ":"I agree to the "}
                  <Link href="/terms" className="text-primary hover:underline">{lang==="th"?"ข้อกำหนดและเงื่อนไข":"Terms & Conditions"}</Link>
                  {lang==="th"?" ของ C&T AGROTECH":" of C&T AGROTECH"}
                </span>
              </label>
              <Button onClick={submit} disabled={loading||!agreed||!form.name||!form.email||!form.pw||!match} className="w-full h-9">
                {loading?<span className="flex items-center gap-2"><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>{lang==="th"?"กำลังสมัคร...":"Registering..."}</span>:tr.signUp}
              </Button>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {tr.hasAccount} <Link href="/auth/signin" className="text-primary font-semibold hover:underline">{tr.signIn}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
