# Mamy Style — Full-Stack E-Commerce

A production-ready, full-stack fashion e-commerce platform built for **Mamy Style** — an Egyptian clothing brand based in Baltim. The store is fully bilingual (Arabic & English) with complete RTL support, a multi-step checkout powered by Paymob card payments, cash on delivery support, automatic WhatsApp order notifications to the shop owner, and a full admin dashboard for managing products, categories, orders, and users.

The project is built with a feature-based architecture using Next.js 16 App Router, Supabase as the backend, and TanStack Query for client-side caching — designed to be fast, maintainable, and ready for a real business.

---

## Live Features

### Store (Customer-facing)
- **Home** — Hero carousel, featured products, categories grid, contact section with embedded map
- **Products** — Filterable catalog with search, category filter, price range slider, and pagination
- **Product Detail** — Image gallery, color/size selection, stock validation, add to cart
- **Cart** — Persistent cart with coupon/discount support and order summary
- **Checkout** — Address form (all Egyptian governorates & cities), shipping fee preview, payment method selection (Paymob online or cash on delivery)
- **Orders** — Order history with status tracking and expandable item details; retry payment for pending online orders
- **Favorites** — Save and manage favorite products
- **Profile** — View and edit account info
- **Auth** — Register, login, forgot password, reset password (Supabase Auth)
- **Static pages** — Shipping policy, returns policy, FAQ

### Admin Dashboard
- **Overview** — Stats cards (revenue, orders, products, users), bar chart (stock by category), donut chart (products by category), new products chart, low stock alert
- **Products** — Full CRUD: create, view, edit, delete; search + status filter + pagination; color swatches, featured badge, stock badge
- **Categories** — Full CRUD with image upload
- **Orders** — View and manage all customer orders, update order status
- **Users** — View all registered users
- **Settings** — Profile management, admin role indicator

### Notifications
- WhatsApp order notification to shop owner on every successful order (via CallMeBot — no Meta approval needed)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | Base UI + shadcn/ui |
| State / Cache | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payments | Paymob |
| i18n | next-intl (Arabic + English, RTL/LTR) |
| Charts | Recharts |
| Carousel | Embla Carousel |
| Notifications | Sonner toasts |
| Icons | Lucide React + React Icons |
| Email | Resend |
| WhatsApp | CallMeBot API |

---

## Project Structure

```
app/                        ← Next.js routing (thin pages only)
  [locale]/
    (auth)/                 ← login, register, forgot/reset password
    (store)/                ← customer-facing store pages
    dashboard/              ← admin dashboard pages

features/                   ← feature-based architecture
  auth/                     ← login, register, password reset
  cart/                     ← cart page, cart state
  categories/               ← category browsing
  checkout/                 ← address form, payment flow, geo data
  dashboard/                ← all admin components, hooks, API
  favorites/                ← favorites page
  home/                     ← homepage sections (hero, products, contact, footer, navbar)
  orders/                   ← customer orders page
  products/                 ← product catalog, detail, sidebar filters
  profile/                  ← profile page

components/                 ← shared components (AuthGate, ui/*)
lib/                        ← Supabase client, Paymob, WhatsApp, geo data
utils/                      ← formatDate, pagination, etc.
messages/                   ← i18n translation files (ar.json, en.json)
```

---

## Getting Started

### 1. Clone and install
```bash
git clone <repo-url>
cd mamy-style
pnpm install
```

### 2. Environment variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYMOB_API_KEY=
PAYMOB_CARD_INTEGRATION_ID=
PAYMOB_IFRAME_ID=
PAYMOB_HMAC_SECRET=

RESEND_API_KEY=

WHATSAPP_OWNER_NUMBER=       # e.g. 201012345678 (no + prefix)
CALLMEBOT_API_KEY=
```

### 3. Run migrations
Run the SQL migration files in `lib/supabase/migrations/` in order via the Supabase SQL editor.

### 4. Start dev server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---