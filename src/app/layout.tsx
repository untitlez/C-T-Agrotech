import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { LangProvider } from "@/contexts/lang-context"
import { MarketProvider } from "@/contexts/market-context"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "C&T AGROTECH — Fertilizer Trading Platform",
  description: "ตลาดซื้อขายสินค้าเกษตรและปุ๋ยออนไลน์ | Agricultural Commodity Exchange",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <LangProvider>
              <MarketProvider>
                {children}
              </MarketProvider>
            </LangProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
