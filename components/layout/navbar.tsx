"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Globe, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/shadcn"
import { Avatar, AvatarFallback } from "@/components/ui/shadcn"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/shadcn"
import { Logo } from "@/components/ui/logo"
import { useLang } from "@/contexts/lang-context"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { lang, setLang, tr } = useLang()
  const { user, signOut } = useAuth()

  const navLinks = [
    { href:"/trade",     label:tr.trade },
    { href:"/market",    label:tr.market },
    { href:"/portfolio", label:tr.portfolio },
    { href:"/futures",   label:tr.futures },
    { href:"/payment",   label:tr.payment },
    { href:"/news",      label:tr.news },
    { href:"/contact",   label:tr.contact },
    { href:"/terms",     label:tr.terms },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-13 items-center justify-between px-4 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link href="/trade" className="flex-shrink-0">
          <Logo size="sm"/>
        </Link>

        {/* Nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {navLinks.map(l=>(
            <Button key={l.href} variant="ghost" size="sm" asChild
              className={cn("h-10 text-sm font-medium",
                pathname===l.href ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" : "text-muted-foreground"
              )}>
              <Link href={l.href}>{l.label}</Link>
            </Button>
          ))}
          {user?.role==="admin" && (
            <Button variant="ghost" size="sm" asChild
              className={cn("h-10 text-sm font-medium gap-1.5", pathname==="/dashboard"?"bg-primary/10 text-primary":"text-muted-foreground")}>
              <Link href="/dashboard"><LayoutDashboard className="size-3.5"/>{tr.dashboard}</Link>
            </Button>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* Theme */}
          <div className="flex items-center gap-1 mr-1">
            <Sun className="size-3.5 text-muted-foreground"/>
            <Switch checked={resolvedTheme==="dark"} onCheckedChange={v=>setTheme(v?"dark":"light")} className="scale-90"/>
            <Moon className="size-3.5 text-muted-foreground"/>
          </div>

          {/* Language */}
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1"
            onClick={()=>setLang(lang==="th"?"en":"th")}>
            <Globe className="size-3"/>
            {lang==="th"?"EN":"TH"}
          </Button>

          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/15 text-primary text-[11px] font-bold">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium max-w-20 truncate hidden sm:block">{user.name}</span>
                  <ChevronDown className="size-3 text-muted-foreground"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {user.role==="admin" && (
                  <DropdownMenuItem onClick={()=>router.push("/dashboard")}>
                    <LayoutDashboard/>{tr.adminDashboard}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem><User/>{tr.portfolio}</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem variant="destructive" onClick={()=>{ signOut(); router.push("/auth/signin") }}>
                  <LogOut/>{tr.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-9 text-xs" asChild>
                <Link href="/auth/signin">{tr.signIn}</Link>
              </Button>
              <Button size="sm" className="h-9 text-xs" asChild>
                <Link href="/auth/signup">{tr.signUp}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
