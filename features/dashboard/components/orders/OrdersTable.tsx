"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateOrderStatus } from "@/features/dashboard/api/orders"
import { formatDateShort } from "@/utils/formatDate"
import type { OrderStatus } from "@/features/dashboard/types"
import type { DashboardOrder } from "@/features/dashboard/api/orders.server"

const STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending_payment: "outline",
  confirmed:       "secondary",
  processing:      "secondary",
  shipped:         "default",
  delivered:       "default",
  cancelled:       "destructive",
}

const ALL_STATUSES: OrderStatus[] = [
  "pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled",
]

type Props = { orders: DashboardOrder[]; page: number; totalPages: number }

export function OrdersTable({ orders, page, totalPages }: Props) {
  const t = useTranslations("dashboard.orders")
  const router = useRouter()
const [search, setSearch] = useState("")

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      router.refresh()
      toast.success(t("statusUpdated"))
    },
    onError: () => toast.error(t("statusError")),
  })

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
  )

  return (
    <div className="px-6 pb-8">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full max-w-sm rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="rounded-xl border overflow-hidden" dir="ltr">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">{t("orderId")}</TableHead>
              <TableHead className="w-64">{t("customer")}</TableHead>
              <TableHead className="w-32">{t("total")}</TableHead>
              <TableHead className="w-28">{t("payment")}</TableHead>
              <TableHead className="w-32">{t("date")}</TableHead>
              <TableHead className="w-40">{t("statusCol")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  {t("noOrders")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {order.profiles?.full_name && (
                        <p className="text-sm font-medium">{order.profiles.full_name}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                      <p className="text-xs text-muted-foreground">{order.address_line}, {order.city}, {order.governorate}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.total.toLocaleString("en-EG")} EGP
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.payment_method === "cod" ? t("cod") : t("online")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateShort(order.created_at)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(val) =>
                        updateMutation.mutate({ id: order.id, status: val as OrderStatus })
                      }
                    >
                      <SelectTrigger className="h-7 w-36 text-xs rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            <Badge variant={STATUS_VARIANTS[s]} className="text-xs">
                              {t(`status.${s}`)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {t("page")} {page} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`?page=${page - 1}`)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => router.push(`?page=${page + 1}`)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
