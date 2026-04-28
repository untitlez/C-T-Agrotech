"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { TickerBar } from "@/components/layout/ticker-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Input, Label } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/shadcn";
import { useLang } from "@/contexts/lang-context";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export default function PaymentPage() {
  const { lang, tr } = useLang();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "card" | "pp">("bank");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txList, setTxList] = useState(MOCK_TRANSACTIONS);

  const handleSubmit = async () => {
    if (!amount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setTxList((prev) => [
      {
        id: `TX${Date.now()}`,
        type: "deposit",
        amount: parseFloat(amount),
        status: "completed",
        method: "bank_transfer",
        createdAt: new Date().toLocaleString("th-TH"),
        description: lang === "th" ? "ฝากเงิน" : "Deposit",
      },
      ...prev,
    ]);
    setTimeout(() => {
      setSuccess(false);
      setAmount("");
    }, 2500);
  };

  const StatusIcon = ({ s }: { s: string }) => {
    if (s === "completed") return <CheckCircle2 className="size-4 text-bull" />;
    if (s === "pending") return <Clock className="size-4 text-amber-500" />;
    return <XCircle className="size-4 text-bear" />;
  };

  const methods = [
    {
      id: "bank" as const,
      label: tr.bankTransfer,
      icon: <Building2 className="size-4" />,
    },
    {
      id: "card" as const,
      label: tr.creditCard,
      icon: <CreditCard className="size-4" />,
    },
    {
      id: "pp" as const,
      label: tr.promptpay,
      icon: <Smartphone className="size-4" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen page-fade">
      <Navbar />
      <TickerBar />
      <main className="flex-1 p-4 max-w-[1100px] mx-auto w-full">
        <h1 className="text-2xl font-bold font-display mb-5">
          {tr.paymentTitle}
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {/* Wallet */}
          <div className="flex flex-col gap-3">
            <Card className="gradient-brand border-0 text-white gap-2 py-4">
              <CardContent className="px-5">
                <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">
                  {tr.wallet}
                </p>
                <p className="text-3xl font-bold font-mono mb-1">฿2,450,000</p>
                <p className="text-[11px] text-white/65">
                  วิภา เกษตรกิจ · ID: U2
                </p>
              </CardContent>
            </Card>
            {[
              {
                l: lang === "th" ? "ฝากเดือนนี้" : "Deposited",
                v: "฿1,500,000",
                c: "text-bull",
              },
              {
                l: lang === "th" ? "ถอนเดือนนี้" : "Withdrawn",
                v: "฿300,000",
                c: "text-bear",
              },
              {
                l: lang === "th" ? "ธุรกรรมทั้งหมด" : "All Tx",
                v: txList.length.toString(),
                c: "text-primary",
              },
            ].map((s) => (
              <Card key={s.l}>
                <CardContent className="py-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    {s.l}
                  </p>
                  <p className={cn("text-lg font-bold font-mono", s.c)}>
                    {s.v}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card className="gap-0 py-0">
            <Tabs defaultValue="deposit">
              <CardHeader className="border-b px-4 py-0">
                <TabsList className="rounded-none border-0 bg-transparent h-12 w-full gap-0">
                  <TabsTrigger
                    value="deposit"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full text-sm"
                  >
                    {tr.deposit}
                  </TabsTrigger>
                  <TabsTrigger
                    value="withdraw"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full text-sm"
                  >
                    {tr.withdraw}
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <TabsContent value="deposit" className="mt-0">
                <CardContent className="pt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase tracking-wider">
                      {tr.paymentMethod}
                    </Label>
                    <div className="flex flex-col gap-1.5">
                      {methods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id)}
                          className={cn(
                            "flex items-center gap-2.5 p-3 rounded-lg border text-sm text-left transition-all",
                            method === m.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-border/80",
                          )}
                        >
                          <span
                            className={
                              method === m.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          >
                            {m.icon}
                          </span>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {method === "pp" && (
                    <div className="flex flex-col items-center p-4 bg-muted/40 rounded-xl">
                      <div className="w-24 h-24 bg-white rounded-xl mb-2 flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 80 80" className="w-20 h-20">
                          <rect
                            x="5"
                            y="5"
                            width="30"
                            height="30"
                            fill="none"
                            stroke="#000"
                            strokeWidth="4"
                          />
                          <rect
                            x="45"
                            y="5"
                            width="30"
                            height="30"
                            fill="none"
                            stroke="#000"
                            strokeWidth="4"
                          />
                          <rect
                            x="5"
                            y="45"
                            width="30"
                            height="30"
                            fill="none"
                            stroke="#000"
                            strokeWidth="4"
                          />
                          <rect
                            x="12"
                            y="12"
                            width="16"
                            height="16"
                            fill="#000"
                          />
                          <rect
                            x="52"
                            y="12"
                            width="16"
                            height="16"
                            fill="#000"
                          />
                          <rect
                            x="12"
                            y="52"
                            width="16"
                            height="16"
                            fill="#000"
                          />
                          <rect
                            x="48"
                            y="48"
                            width="6"
                            height="6"
                            fill="#000"
                          />
                          <rect
                            x="58"
                            y="48"
                            width="6"
                            height="6"
                            fill="#000"
                          />
                          <rect
                            x="48"
                            y="58"
                            width="6"
                            height="6"
                            fill="#000"
                          />
                          <rect
                            x="58"
                            y="58"
                            width="6"
                            height="6"
                            fill="#000"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        PromptPay: 0812345678
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase tracking-wider">
                      {lang === "th" ? "จำนวนเงิน (บาท)" : "Amount (THB)"}
                    </Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="text-lg h-11"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[10000, 50000, 100000, 200000, 500000, 1000000].map(
                      (a) => (
                        <button
                          key={a}
                          onClick={() => setAmount(String(a))}
                          className="py-1.5 text-[11px] font-semibold rounded-md border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground transition-all"
                        >
                          {a >= 1000000 ? `${a / 1000000}M` : `${a / 1000}K`}
                        </button>
                      ),
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !amount}
                    className="w-full h-10"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {lang === "th" ? "กำลังดำเนินการ..." : "Processing..."}
                      </span>
                    ) : success ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        {lang === "th" ? "สำเร็จ!" : "Success!"}
                      </span>
                    ) : (
                      tr.deposit
                    )}
                  </Button>
                </CardContent>
              </TabsContent>
              <TabsContent value="withdraw" className="mt-0">
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-1.5 mb-4">
                    <Label className="text-[10px] uppercase tracking-wider">
                      {lang === "th" ? "จำนวนเงิน (บาท)" : "Amount (THB)"}
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="text-lg h-11"
                    />
                  </div>
                  <Button variant="outline" className="w-full h-10">
                    {tr.withdraw}
                  </Button>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          {/* TX History */}
          <Card className="gap-0 py-0">
            <CardHeader className="border-b px-4 py-3">
              <CardTitle>{tr.txHistory}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col">
              {txList.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <StatusIcon s={tx.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {tx.createdAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-mono font-bold",
                        tx.amount > 0 ? "text-bull" : "text-bear",
                      )}
                    >
                      {tx.amount > 0 ? "+" : ""}฿
                      {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        tx.status === "completed"
                          ? "bull"
                          : tx.status === "pending"
                            ? "gold"
                            : "bear"
                      }
                      className="text-[8px] h-3.5 mt-0.5"
                    >
                      {lang === "th"
                        ? tx.status === "completed"
                          ? "สำเร็จ"
                          : tx.status === "pending"
                            ? "รอดำเนินการ"
                            : "ล้มเหลว"
                        : tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
