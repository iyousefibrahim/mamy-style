"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogMedia, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { useCoupons, useDeleteCoupon, useToggleCoupon } from "@/features/dashboard/hooks/useCoupons"
import { getPageItems, PAGE_SIZE } from "@/utils/pagination"
import type { Coupon } from "@/features/dashboard/types"

export function CouponsTable() {
  const t = useTranslations("dashboard.coupons")
  const tc = useTranslations("dashboard.common")
  const tg = useTranslations("common")
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)

  const { data: result, isLoading, isError } = useCoupons({ search, page })
  const deleteCoupon = useDeleteCoupon()
  const toggleCoupon = useToggleCoupon()

  const coupons = result?.data ?? []
  const totalPages = Math.ceil((result?.total ?? 0) / PAGE_SIZE)

  function handleDelete() {
    if (!deleteTarget) return
    deleteCoupon.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(tc("delete") + " ✓")
        setDeleteTarget(null)
      },
      onError: (err) => {
        toast.error(err.message)
        setDeleteTarget(null)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border overflow-x-auto" dir="ltr">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("colCode")}</TableHead>
              <TableHead>{t("colBenefit")}</TableHead>
              <TableHead>{t("colUsage")}</TableHead>
              <TableHead>{t("colExpires")}</TableHead>
              <TableHead>{t("colActive")}</TableHead>
              <TableHead>{t("colCreatedAt")}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  {tg("loading")}
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-destructive py-8">
                  {tg("error")}
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  {tc("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-0.5 text-sm font-mono font-medium">
                      {c.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.discount_percent > 0 && (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {c.discount_percent}% {t("off")}
                        </Badge>
                      )}
                      {c.free_shipping && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {t("freeShipping")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {c.used_count}
                      <span className="text-muted-foreground"> / {c.max_uses}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.expires_at ? formatDate(c.expires_at) : "—"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={c.is_active}
                      disabled={toggleCoupon.isPending}
                      onCheckedChange={(val) =>
                        toggleCoupon.mutate(
                          { id: c.id, is_active: val },
                          { onError: (err) => toast.error(err.message) }
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(c.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/coupons/${c.id}/edit` as "/dashboard")}
                        >
                          {tc("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(c)}
                        >
                          {tc("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
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
                    onClick={(e) => { e.preventDefault(); setPage(item) }}
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
                onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }}
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 className="size-5 text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>{tc("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tc("deleteConfirmDesc")}
              {deleteTarget && (
                <span className="mt-1 block font-medium text-foreground">
                  &ldquo;{deleteTarget.code}&rdquo;
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteCoupon.isPending}
              onClick={handleDelete}
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
