"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { TickerBar } from "@/components/layout/ticker-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { Logo } from "@/components/ui/logo";
import { useLang } from "@/contexts/lang-context";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

export default function ContactPage() {
  const { lang, tr } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const f =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const send = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  const info = [
    {
      icon: <MapPin className="size-4" />,
      l: tr.address,
      v:
        lang === "th"
          ? "121 ม.1  ต.ท่าสาย อ.เมือง จ.เชียงราย 57000"
          : "121 M.1 Tha Sai, Mueang, Chiang Rai 57000",
    },
    {
      icon: <Phone className="size-4" />,
      l: lang === "th" ? "โทรศัพท์" : "Phone",
      v: "086-30425812",
    },
    {
      icon: <Mail className="size-4" />,
      l: "Email",
      v: "ceeandtee005@gmail.com",
    },
    {
      icon: <Clock className="size-4" />,
      l: tr.officeHours,
      v: lang === "th" ? "จันทร์–ศุกร์ 08:00–17:00 น." : "Mon–Fri 08:00–17:00",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar />
      <TickerBar />
      {/* Hero */}
      <div className="gradient-brand text-white py-14 px-4 text-center">
        <h1 className="text-3xl font-bold font-display mb-2">
          {tr.contactTitle}
        </h1>
        <p className="text-white/75 text-sm max-w-md mx-auto">
          {tr.contactDesc}
        </p>
      </div>
      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 pb-8 mt-5 relative z-10">
        <div className="grid grid-cols-5 gap-5">
          {/* Info */}
          <div className="col-span-2 flex flex-col gap-3">
            <Card className="overflow-hidden gap-3">
              <div className="gradient-brand p-5 -mt-6">
                <p className="font-semibold">C&T AGROTECH</p>
                <p className="text-white/80 text-xs leading-relaxed">
                  {lang === "th"
                    ? "แพลตฟอร์มซื้อขายปุ๋ยและสารเคมีเกษตรออนไลน์ มุ่งมั่นสร้างตลาดเกษตรที่โปร่งใสและเป็นธรรม"
                    : "is a comprehensive online agricultural commodity trading platform committed to a transparent and fair market."}
                </p>
              </div>
              <CardContent className="pt-4 flex flex-col gap-3.5">
                {info.map((i) => (
                  <div key={i.l} className="flex items-start gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      {i.icon}
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                        {i.l}
                      </p>
                      <p className="text-xs leading-relaxed">{i.v}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="col-span-3 gap-0">
            <CardContent>
              <h2 className="text-base font-bold font-display flex items-center gap-2 mb-5">
                <MessageSquare className="size-4 text-primary" />
                {lang === "th" ? "ฝากข้อความ" : "Send a Message"}
              </h2>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                  <CheckCircle2 className="size-14 text-bull" />
                  <p className="text-lg font-semibold">{tr.messageSent}</p>
                  <p className="text-sm text-muted-foreground">
                    {lang === "th"
                      ? "ทีมงานจะตอบกลับภายใน 24 ชั่วโมง"
                      : "Our team will respond within 24 hours."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs">{tr.yourName} *</Label>
                      <Input
                        value={form.name}
                        onChange={f("name")}
                        placeholder={lang === "th" ? "สมชาย ใจดี" : "John Doe"}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs">{tr.email} *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={f("email")}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">{tr.subject}</Label>
                    <Input
                      value={form.subject}
                      onChange={f("subject")}
                      placeholder={
                        lang === "th"
                          ? "สอบถามเกี่ยวกับสินค้า"
                          : "Product inquiry"
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(lang === "th"
                      ? [
                          "สอบถามราคา",
                          "ลงทะเบียน",
                          "ปัญหาชำระเงิน",
                          "KYC",
                          "รายงานปัญหา",
                        ]
                      : [
                          "Pricing",
                          "Registration",
                          "Payment issue",
                          "KYC",
                          "Report issue",
                        ]
                    ).map((t) => (
                      <button
                        key={t}
                        onClick={() => setForm({ ...form, subject: t })}
                        className="px-2.5 py-1 text-[10px] rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">{tr.message} *</Label>
                    <Textarea
                      value={form.message}
                      onChange={f("message")}
                      placeholder={
                        lang === "th"
                          ? "รายละเอียดข้อความ..."
                          : "Your message details..."
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button
                    onClick={send}
                    disabled={
                      loading || !form.name || !form.email || !form.message
                    }
                    className="w-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {lang === "th" ? "กำลังส่ง..." : "Sending..."}
                      </span>
                    ) : (
                      tr.sendMessage
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
