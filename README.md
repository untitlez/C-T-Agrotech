# C&T AGROTECH — Fertilizer Trading Platform v2

**Stack:** Next.js 15.5 · Tailwind CSS v4 · shadcn/ui (new-york) · TypeScript · React 19

**Primary Color:** Tiffany Blue `oklch(66% 0.14 194)` ≈ `#0ABFBC`

---

## ⚡ Quick Setup

### 1. Create Next.js project

```bash
npx create-next-app@latest ct-agrotech \
  --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*"
cd ct-agrotech
```

### 2. Init shadcn/ui (auto-detects Tailwind v4)

```bash
npx shadcn@latest init
# Prompts:
#  Style       → new-york
#  Base color  → neutral
#  CSS vars    → yes
```

### 3. Add shadcn components

```bash
npx shadcn@latest add button card badge input label separator \
  tabs switch select dialog dropdown-menu scroll-area \
  tooltip avatar skeleton
```

### 4. Install additional packages

```bash
npm install next-themes tw-animate-css lucide-react
```

### 5. Copy project files

Copy all files from this package, **replacing** what `create-next-app` generated:

```
src/
├── app/
│   ├── globals.css          ← REPLACE (Tiffany Blue theme + Tailwind v4 @theme)
│   ├── layout.tsx           ← REPLACE
│   ├── page.tsx             ← REPLACE
│   ├── trade/page.tsx       ← ADD
│   ├── market/page.tsx      ← ADD
│   ├── portfolio/page.tsx   ← ADD
│   ├── futures/page.tsx     ← ADD
│   ├── payment/page.tsx     ← ADD
│   ├── news/page.tsx        ← ADD
│   ├── contact/page.tsx     ← ADD
│   ├── terms/page.tsx       ← ADD
│   ├── dashboard/page.tsx   ← ADD
│   └── auth/
│       ├── signin/page.tsx  ← ADD
│       └── signup/page.tsx  ← ADD
├── components/
│   ├── ui/
│   │   ├── button.tsx       ← REPLACE (adds bull/bear/brand variants)
│   │   ├── card.tsx         ← REPLACE (new-york style)
│   │   ├── primitives.tsx   ← ADD (Input, Label, Badge, Separator, Textarea)
│   │   ├── shadcn.tsx       ← ADD (Tabs, Switch, Select, Dialog, Dropdown,
│   │   │                          ScrollArea, Tooltip, Avatar, Skeleton)
│   │   └── logo.tsx         ← ADD (C&T SVG logo component)
│   ├── charts/index.tsx     ← ADD (Sparkline, CandleChart, VolumeBar)
│   ├── layout/
│   │   ├── navbar.tsx       ← ADD
│   │   └── ticker-bar.tsx   ← ADD
│   └── trading/
│       ├── index.tsx        ← ADD (OrderBook, TradeFeed, PlaceOrder)
│       └── market-card.tsx  ← ADD
├── contexts/
│   ├── auth-context.tsx     ← ADD
│   ├── lang-context.tsx     ← ADD (TH/EN translations)
│   └── market-context.tsx   ← ADD (live price simulation)
├── lib/
│   ├── mock-data.ts         ← ADD
│   └── utils.ts             ← REPLACE (adds fmt helpers)
└── types/index.ts           ← ADD
```

Also replace root config files:
- `postcss.config.mjs` — Tailwind v4 uses `@tailwindcss/postcss`
- `next.config.ts` — minimal config
- `components.json` — new-york style
- **DELETE** `tailwind.config.js/ts` — Tailwind v4 has no config file

### 6. Run

```bash
npm run dev   # uses Turbopack by default (Next.js 15.5)
```

Open [http://localhost:3000](http://localhost:3000) → auto-redirects to `/trade`

---

## 🎨 Tailwind v4 Theme Notes

**No `tailwind.config.js`** — all theme is in `globals.css` via `@theme inline {}`.

The Tiffany Blue primary color is defined as OKLCH:
```css
--primary: oklch(66% 0.14 194);   /* light mode */
--primary: oklch(68% 0.15 194);   /* dark mode  */
```

Custom trading utilities exposed:
```css
--color-bull:       oklch(62% 0.19 152);   /* green  */
--color-bear:       oklch(58% 0.22 25);    /* red    */
--color-bull-muted: oklch(62% 0.19 152 / 12%);
--color-bear-muted: oklch(58% 0.22 25 / 12%);
```

Use in JSX: `className="text-bull"`, `className="text-bear"`, etc.

---

## 🗂️ Pages

| Route | Description |
|-------|-------------|
| `/trade` | Full trading terminal: candlestick chart, order book, trade feed, place order |
| `/market` | Market overview table + news sidebar |
| `/portfolio` | Holdings, P&L, allocation chart, open orders |
| `/futures` | Futures contracts 3M/6M/12M by commodity |
| `/payment` | Deposit/withdraw form + transaction history |
| `/news` | Market news with bullish/bearish impact indicators |
| `/contact` | Contact form + company info |
| `/terms` | Investment terms & risk management (accordion) |
| `/dashboard` | Admin dashboard: users, transactions, market, KYC, system status |
| `/auth/signin` | Sign in with demo account selector |
| `/auth/signup` | Sign up with password strength indicator |

---

## 🔑 Demo Accounts

| Email | Role |
|-------|------|
| `somchai@gmail.com` | **Admin** — Dashboard visible |
| `akkarawit@gmail.com` | **Trader** |

Password: any value (mock auth)

---

## 🌐 i18n

Toggle Thai/English via the globe button in the navbar. All translations live in `src/contexts/lang-context.tsx`.

## 🌗 Theme

Toggle dark/light via the sun/moon switch in the navbar (powered by `next-themes`).

---

## ⚠️ shadcn/ui Components Used (100% — no custom duplicates)

- `Button` (+ custom variants: `bull`, `bear`, `brand`)
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardAction`
- `Badge` (+ variants: `bull`, `bear`, `gold`, `tiffany`, `muted`)
- `Input`, `Label`, `Separator`, `Textarea`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Switch`
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`
- `ScrollArea`
- `Tooltip`, `TooltipProvider`, `TooltipContent`
- `Avatar`, `AvatarFallback`
- `Skeleton`

All components follow shadcn's **new-york** style with `data-slot` attributes and OKLCH colors.

---

## 🚀 Production Roadmap

1. **Auth** → Replace mock with NextAuth.js v5 or Clerk
2. **API** → Connect to real REST/GraphQL backend
3. **WebSocket** → Real-time order book & price feeds
4. **Charts** → Upgrade to TradingView Lightweight Charts
5. **Payment** → Integrate Omise or 2C2P
6. **KYC** → Sumsub or Jumio integration
7. **i18n** → Migrate to `next-intl` for advanced locale support
