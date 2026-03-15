"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { mockProducts, type MockProduct } from "@/lib/mock/products"

const PAGE_SIZE = 10

export function ProductsTable() {
  const t = useTranslations("dashboard.products")
  const tc = useTranslations("dashboard.common")
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<MockProduct | null>(null)

  const filtered = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function formatPrice(price: number) {
    return `${price.toLocaleString("en-US")} EGP`
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB")
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("allStatus")}</SelectItem>
            <SelectItem value="active">{tc("active")}</SelectItem>
            <SelectItem value="inactive">{tc("inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border" dir="ltr">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tc("colId")}</TableHead>
              <TableHead>{t("colName")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead>{t("colStock")}</TableHead>
              <TableHead>{t("colPrice")}</TableHead>
              <TableHead>{t("colCreatedAt")}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  formatPrice={formatPrice}
                  formatDate={formatDate}
                  t={t}
                  tc={tc}
                  onView={() => router.push(`/dashboard/products/${p.id}` as "/dashboard")}
                  onEdit={() => router.push(`/dashboard/products/${p.id}/edit` as "/dashboard")}
                  onDelete={() => setDeleteTarget(p)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {tc("previous")}
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="sm"
              className="size-8"
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {tc("next")}
          </Button>
        </div>
      )}

      {/* Delete confirmation */}
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
                  &ldquo;{deleteTarget.name}&rdquo;
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                toast.info(tc("comingSoon"))
                setDeleteTarget(null)
              }}
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ProductRow({
  product: p,
  formatPrice,
  formatDate,
  t,
  tc,
  onView,
  onEdit,
  onDelete,
}: {
  product: MockProduct
  formatPrice: (n: number) => string
  formatDate: (s: string) => string
  t: (k: string) => string
  tc: (k: string) => string
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <TableRow>
      <TableCell>
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {p.id}
        </code>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{p.name}</span>
          {p.is_featured && (
            <Badge className="shrink-0 border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
              {t("featured")}
            </Badge>
          )}
          {p.colors.length > 0 && (
            <div className="flex gap-0.5">
              {p.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="size-3 rounded-full border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={p.status === "active" ? "default" : "secondary"}>
          {p.status === "active" ? tc("active") : tc("inactive")}
        </Badge>
      </TableCell>
      <TableCell>{p.stock}</TableCell>
      <TableCell>{formatPrice(p.price)}</TableCell>
      <TableCell>{formatDate(p.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>{tc("view")}</DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>{tc("edit")}</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              {tc("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
