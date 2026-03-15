"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts } from "@/lib/mock/products"
import { mockCategories } from "@/lib/mock/categories"

export function StockByCategoryChart() {
  const t = useTranslations("dashboard.overview")

  const data = mockCategories
    .map((cat) => ({
      name: cat.name,
      stock: mockProducts
        .filter((p) => p.category_id === cat.id)
        .reduce((sum, p) => sum + p.stock, 0),
    }))
    .filter((d) => d.stock > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("stockByCategory")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="stock" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
