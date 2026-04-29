"use client"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { TickerBar } from "@/components/layout/ticker-bar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/primitives"
import { useLang } from "@/contexts/lang-context"
import { useMarket } from "@/contexts/market-context"
import { ADMIN_STATS, MOCK_USERS, MOCK_TRANSACTIONS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import TABLE_DATA from "@/table.json"
import {
  Users, Activity, BarChart3, DollarSign, AlertCircle,
  TrendingUp, Search, ShieldCheck, ShieldX, FileText, Download, Eye
} from "lucide-react"

export default function DashboardPage() {
  const { lang, tr } = useLang()
  const { market } = useMarket()
  const [search, setSearch] = useState("")
  const [verified, setVerified] = useState<Set<string>>(new Set())
  const [viewingTx, setViewingTx] = useState<string | null>(null)

  // Transform table.json data into transaction format
  const transactions = TABLE_DATA.map((tx, index) => {
    const amount = parseFloat(tx["จำนวน"].replace(/,/g, ''))
    const isPositive = amount > 0
    const status = tx["สถานะ"] === "X1" ? "completed" : tx["สถานะ"] === "X2" ? "failed" : "pending"
    const channel = tx["ช่องทาง"]
    const date = tx["วัน"]
    const time = tx["เวลา"]

    // Generate unique constant transaction ID
    const txId = `TX${String(index + 1).padStart(6, '0')}`

    // Create description based on channel and status
    const description = lang === "th"
      ? `${isPositive ? "ฝากเงิน" : "ถอนเงิน"}`
      : `${isPositive ? "Deposit" : "Withdrawal"}`

    return {
      id: txId,
      description,
      amount,
      method: channel.toLowerCase(),
      status,
      type: isPositive ? "deposit" : "withdrawal",
      date,
      time,
      channel,
      originalStatus: tx["สถานะ"]
    }
  }).reverse() // Show newest first

  const handleOpenPDF = (txId: string, txType: string) => {
    setViewingTx(txId)
    // Generate PDF document from transaction data
    const tx = transactions.find(t => t.id === txId)
    if (tx) {
      setTimeout(() => {
        generateTransactionPDF(tx, lang)
        setViewingTx(null)
      }, 500)
    }
  }

  const generateTransactionPDFContent = (tx: any, currentLang: string) => {
    // Return the HTML content for PDF generation
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Transaction_${tx.id}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');
        body {
            font-family: 'Sarabun', sans-serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: #ffffff;
            color: #333;
        }
        .document {
            background: white;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #1e40af;
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header h2 {
            color: #475569;
            margin: 0;
            font-size: 16px;
            font-weight: 400;
        }
        .document-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 12px;
            color: #64748b;
        }
        .info-section {
            margin: 25px 0;
        }
        .section-title {
            background: #f1f5f9;
            padding: 12px 15px;
            font-weight: 600;
            font-size: 16px;
            color: #1e40af;
            border-left: 4px solid #1e40af;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-row {
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background: #fafafa;
        }
        .info-label {
            font-weight: 600;
            font-size: 12px;
            color: #64748b;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .info-value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 400;
        }
        .amount-section {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .amount-label {
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
        }
        .amount-value {
            font-size: 36px;
            font-weight: 700;
            margin: 0;
        }
        .amount-value.positive {
            color: #22c55e;
        }
        .amount-value.negative {
            color: #ef4444;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
        }
        .status-success {
            background: #dcfce7;
            color: #166534;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-failed {
            background: #fee2e2;
            color: #991b1b;
        }
        .additional-details {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .additional-details h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 16px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        .details-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
        }
        .details-list li:last-child {
            border-bottom: none;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: #f8fafc;
            border-radius: 10px;
            border: 2px solid #e2e8f0;
        }
        .action-buttons h3 {
            margin: 0 0 20px 0;
            color: #1e40af;
            font-size: 18px;
        }
        .button-group {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .action-btn {
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: 'Sarabun', sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .btn-download {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            font-size: 16px;
            padding: 16px 32px;
        }
        .btn-download:hover {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
        }
        .btn-print {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
        }
        .btn-print:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .btn-close {
            background: linear-gradient(135deg, #64748b 0%, #475569 100%);
            color: white;
        }
        .btn-close:hover {
            background: linear-gradient(135deg, #475569 0%, #334155 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 11px;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: #f1f5f9;
            z-index: -1;
            font-weight: 700;
        }
        @media print {
            body { margin: 0; padding: 15mm; }
            .no-print { display: none !important; }
            .action-buttons { display: none !important; }
        }
        @media (max-width: 768px) {
            .button-group { flex-direction: column; }
            .action-btn { width: 100%; justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="watermark">C-T AGROTECH</div>
    <div class="document">
        <div class="header">
            <h1>${currentLang === 'th' ? 'ใบรับรองธุรกรรม' : 'Transaction Certificate'}</h1>
            <h2>C-T AGROTECH TRADING PLATFORM</h2>
        </div>

        <div class="document-info">
            <div>
                <strong>${currentLang === 'th' ? 'เลขที่เอกสาร:' : 'Document No:'}</strong> ${tx.id}
            </div>
            <div>
                <strong>${currentLang === 'th' ? 'วันที่ออกเอกสาร:' : 'Issued Date:'}</strong> ${new Date().toLocaleString('th-TH')}
            </div>
        </div>

        <div class="info-section">
            <div class="section-title">
                ${currentLang === 'th' ? 'ข้อมูลธุรกรรม' : 'Transaction Information'}
            </div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">${currentLang === 'th' ? 'วันที่ทำรายการ' : 'Transaction Date'}</div>
                    <div class="info-value">${tx.date}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">${currentLang === 'th' ? 'เวลาที่ทำรายการ' : 'Transaction Time'}</div>
                    <div class="info-value">${tx.time}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">${currentLang === 'th' ? 'ประเภทรายการ' : 'Transaction Type'}</div>
                    <div class="info-value">${tx.description}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">${currentLang === 'th' ? 'ช่องทาง' : 'Channel'}</div>
                    <div class="info-value">${tx.channel}</div>
                </div>
            </div>
        </div>

        <div class="amount-section">
            <div class="amount-label">${currentLang === 'th' ? 'จำนวนเงิน' : 'Transaction Amount'}</div>
            <div class="amount-value ${tx.amount > 0 ? 'positive' : 'negative'}">
                ${tx.amount > 0 ? '+' : ''}฿${Math.abs(tx.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
        </div>

        <div class="info-section">
            <div class="section-title">
                ${currentLang === 'th' ? 'สถานะธุรกรรม' : 'Transaction Status'}
            </div>
            <div style="text-align: center; padding: 20px;">
                <span class="status-badge ${tx.status === 'completed' ? 'status-success' : tx.status === 'pending' ? 'status-pending' : 'status-failed'}">
                    ${currentLang === 'th' ?
                      (tx.status === 'completed' ? '✓ สำเร็จ' : tx.status === 'pending' ? '◷ รอดำเนินการ' : '✗ ล้มเหลว') :
                      (tx.status === 'completed' ? '✓ Completed' : tx.status === 'pending' ? '◷ Pending' : '✗ Failed')}
                </span>
            </div>
        </div>

        <div class="additional-details">
            <h3>${currentLang === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional Details'}</h3>
            <ul class="details-list">
                <li>
                    <span>${currentLang === 'th' ? 'รหัสอ้างอิง:' : 'Reference Code:'}</span>
                    <strong>${tx.id}</strong>
                </li>
                <li>
                    <span>${currentLang === 'th' ? 'รหัสสถานะ:' : 'Status Code:'}</span>
                    <strong>${tx.originalStatus}</strong>
                </li>
                <li>
                    <span>${currentLang === 'th' ? 'วิธีการชำระเงิน:' : 'Payment Method:'}</span>
                    <strong>${tx.method}</strong>
                </li>
                <li>
                    <span>${currentLang === 'th' ? 'ประเภทบัญชี:' : 'Account Type:'}</span>
                    <strong>${currentLang === 'th' ? 'บัญชีซื้อขายล่วงหน้า' : 'Trading Account'}</strong>
                </li>
                <li>
                    <span>${currentLang === 'th' ? 'แพลตฟอร์ม:' : 'Platform:'}</span>
                    <strong>C-T Agrotech</strong>
                </li>
            </ul>
            <p style="margin-top: 15px; color: #64748b; font-size: 13px;">
                ${currentLang === 'th' ?
                  'รายการนี้ได้รับการยืนยันและบันทึกในระบบอย่างถูกต้อง สามารถใช้เป็นหลักฐานในการทำธุรกรรมได้' :
                  'This transaction has been confirmed and properly recorded in the system. Can be used as transaction evidence.'}
            </p>
        </div>

        <div class="action-buttons no-print">
            <h3>${currentLang === 'th' ? '📋 ดำเนินการเอกสาร' : '📋 Document Actions'}</h3>
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 6px;">
                <p style="color: #1e40af; margin: 0; font-size: 13px; font-weight: 600;">
                    ${currentLang === 'th' ?
                      '💡 วิธีดาวน์โหลด PDF: กดปุ่ม "ดาวน์โหลด PDF" แล้วเลือก "บันทึกเป็น PDF" หรือ "Microsoft Print to PDF"' :
                      '💡 To download PDF: Click "Download PDF" button, then select "Save as PDF" or "Microsoft Print to PDF"'}
                </p>
            </div>
            <div class="button-group">
                <button onclick="downloadAsPDF()" class="action-btn btn-download">
                    💾 ${currentLang === 'th' ? 'ดาวน์โหลด PDF (Download PDF)' : 'Download PDF'}
                </button>
                <button onclick="printDocument()" class="action-btn btn-print">
                    🖨️ ${currentLang === 'th' ? 'พิมพ์เอกสาร (Print)' : 'Print Document'}
                </button>
                <button onclick="window.close()" class="action-btn btn-close">
                    ✖️ ${currentLang === 'th' ? 'ปิดหน้าต่าง (Close)' : 'Close Window'}
                </button>
            </div>
        </div>

        <div class="footer">
            <p><strong>${currentLang === 'th' ? 'หมายเหตุ:' : 'Note:'}</strong>
            ${currentLang === 'th' ?
              'เอกสารนี้เป็นเอกสารอิเล็กทรอนิกส์ที่ถูกต้องตามกฎหมาย สามารถนำไปใช้ในการอ้างอิงและยืนยันข้อมูลได้' :
              'This is a valid electronic document that can be used for reference and data verification.'}
            </p>
            <p style="margin-top: 10px;">
                ${currentLang === 'th' ? 'สร้างอัตโนมัติเมื่อ:' : 'Automatically generated on:'} ${new Date().toLocaleString('th-TH')}
            </p>
            <p style="margin-top: 5px; color: #94a3b8;">
                © 2026 C-T Agrotech Trading Platform. All rights reserved.
            </p>
        </div>
    </div>

    <script>
        function downloadAsPDF() {
            // Trigger print dialog specifically for PDF download
            // User needs to select "Save as PDF" or "Microsoft Print to PDF" as destination
            window.print();
        }

        function printDocument() {
            // Open print dialog for printing
            window.print();
        }

        // Add helpful instruction on page load (no auto-print)
        window.addEventListener('load', function() {
            ${currentLang === 'th' ?
              'console.log("หากต้องการบันทึกเป็น PDF: กดปุ่มดาวน์โหลด แล้วเลือก \\"บันทึกเป็น PDF\\" หรือ \\"Microsoft Print to PDF\\"");' :
              'console.log("To save as PDF: Click Download button and select \\"Save as PDF\\" or \\"Microsoft Print to PDF\\"");'}
        });
    </script>
</body>
</html>`
  }

  const generateTransactionPDF = (tx: any, currentLang: string) => {
    // Generate HTML content for PDF
    const htmlContent = generateTransactionPDFContent(tx, currentLang)

    // Open in new window for viewing (no auto-print)
    const viewWindow = window.open('', '_blank', 'width=900,height=1200,scrollbars=yes')
    if (viewWindow) {
      viewWindow.document.write(htmlContent)
      viewWindow.document.close()
    }
  }

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

  const handleExportAll = () => {
    // Create CSV content
    const headers = lang === "th"
      ? ["ID", "วันที่", "เวลา", "รายละเอียด", "ช่องทาง", "จำนวน", "สถานะ", "รหัสสถานะ"]
      : ["ID", "Date", "Time", "Description", "Channel", "Amount", "Status", "Status Code"]

    const csvContent = [
      headers.join(","),
      ...transactions.map(tx => [
        tx.id,
        tx.date,
        tx.time,
        tx.description,
        tx.channel,
        tx.amount,
        tx.status,
        tx.originalStatus
      ].join(","))
    ].join("\n")

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
              <CardHeader className="border-b px-4 py-3 flex-row items-center justify-between space-y-0">
                <CardTitle>{lang==="th"?"ธุรกรรมล่าสุด":"Recent Transactions"}</CardTitle>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={handleExportAll}>
                  <Download className="size-3"/>
                  {lang==="th"?"ส่งออกทั้งหมด":"Export All"}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {[
                        lang==="th"?"วันที่":"Date",
                        lang==="th"?"เวลา":"Time",
                        lang==="th"?"รายละเอียด":"Description",
                        lang==="th"?"ช่องทาง":"Channel",
                        lang==="th"?"จำนวน":"Amount",
                        tr.status,
                        ""
                      ].map(h=>(
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx=>(
                      <tr key={tx.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 text-[12px] text-muted-foreground">{tx.date}</td>
                        <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">{tx.time}</td>
                        <td className={cn("px-4 py-2.5 text-xs font-semibold", tx.amount>0?"text-bull":"text-bear")}>
                          {tx.description}
                        </td>
                        <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                          {tx.channel}
                        </td>
                        <td className={cn("px-4 py-2.5 font-mono text-sm font-bold", tx.amount>0?"text-bull":"text-bear")}>
                          {tx.amount>0?"+":""}฿{Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant={tx.status==="completed"?"bull":tx.status==="pending"?"gold":"bear"} className="text-[11px]">
                            {lang==="th"
                              ? tx.status==="completed"?"สำเร็จ":tx.status==="pending"?"รอดำเนินการ":"ล้มเหลว"
                              : tx.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-[12px] px-2 gap-1.5 text-primary hover:text-primary hover:bg-primary/5"
                            onClick={() => handleOpenPDF(tx.id, tx.type)}
                            disabled={viewingTx === tx.id}
                          >
                            {viewingTx === tx.id ? (
                              <>
                                <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                                {lang==="th"?"กำลังเปิด...":"Opening..."}
                              </>
                            ) : (
                              <>
                                <FileText className="size-3"/>
                                {lang==="th"?"เปิดเอกสาร":"Open"}
                              </>
                            )}
                          </Button>
                        </td>
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
