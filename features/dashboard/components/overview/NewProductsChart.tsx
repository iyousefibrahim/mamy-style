"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts } from "@/lib/mock/products"

function buildMonthlyData() {
  const months: Record<string, number> = {}
  // Build last 6 months buckets
  for (let i = 5; i >= 0; i--) {
    const d = new Date(2025, 11 - i, 1) // Dec 2025 going back
    const key = d.toLocaleString("en", { month: "short", year: "numeric" })
    months[key] = 0
  }
  mockProducts.forEach((p) => {
    const d = new Date(p.created_at)
    const key = d.toLocaleString("en", { month: "short", year: "numeric" })
    if (key in months) months[key]++
  })
  return Object.entries(months).map(([month, count]) => ({ month, count }))
}

export function NewProductsChart() {
  const t = useTranslations("dashboard.overview")
  const data = buildMonthlyData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("newProductsOverTime")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ left: -10 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
