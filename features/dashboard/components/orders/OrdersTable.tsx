"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Eye, ShoppingBag } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { updateOrderStatus } from "@/features/dashboard/api/orders"
import { formatDateShort } from "@/utils/formatDate"
import { getPageItems } from "@/utils/pagination"
import type { OrderStatus } from "@/features/dashboard/types"
import type { DashboardOrder } from "@/features/dashboard/api/orders.server"

const STATUS_DOT: Record<OrderStatus, string> = {
  pending_payment: "bg-muted-foreground",
  confirmed:       "bg-blue-500",
  processing:      "bg-yellow-500",
  shipped:         "bg-purple-500",
  delivered:       "bg-green-500",
  cancelled:       "bg-destructive",
}

const ALL_STATUSES: OrderStatus[] = [
  "pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled",
]

type Props = { orders: DashboardOrder[]; page: number; totalPages: number }

export function OrdersTable({ orders, page, totalPages }: Props) {
  const t = useTranslations("dashboard.orders")
  const tc = useTranslations("dashboard.common")
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null)

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
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
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
                  <TableCell className="text-xs text-muted-foreground">
                    {order.payment_method === "cod" ? t("cod") : t("online")}
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
                            <span className="flex items-center gap-2">
                              <span className={`size-2 rounded-full shrink-0 ${STATUS_DOT[s]}`} />
                              {t(`status.${s}`)}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                      aria-label={t("viewItems")}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text={tc("previous")}
                onClick={(e) => { e.preventDefault(); router.push(`?page=${page - 1}`) }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {getPageItems(page, totalPages).map((item, i) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={(e) => { e.preventDefault(); router.push(`?page=${item}`) }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                text={tc("next")}
                onClick={(e) => { e.preventDefault(); router.push(`?page=${page + 1}`) }}
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Order items sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                    #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </code>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatDateShort(selectedOrder.created_at)}
                  </span>
                </SheetTitle>
                {selectedOrder.profiles?.full_name && (
                  <p className="text-sm text-muted-foreground">{selectedOrder.profiles.full_name} · {selectedOrder.phone}</p>
                )}
              </SheetHeader>

              {/* Items */}
              <div className="space-y-3 px-4">
                {selectedOrder.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border">
                    <div className="relative size-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <ShoppingBag className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex gap-1.5 flex-wrap mt-0.5">
                        {item.color && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{item.color}</span>
                        )}
                        {item.size && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{item.size}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      {(item.price * item.quantity).toLocaleString()} EGP
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{selectedOrder.subtotal.toLocaleString()} EGP</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("discount")}</span>
                    <span>-{selectedOrder.discount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span>{selectedOrder.shipping_fee.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>{t("total")}</span>
                  <span>{selectedOrder.total.toLocaleString()} EGP</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
