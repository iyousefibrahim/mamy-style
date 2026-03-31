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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useCategories, useDeleteCategory } from "@/features/dashboard/hooks/useCategories"
import { getPageItems, PAGE_SIZE } from "@/utils/pagination"
import type { Category } from "@/features/dashboard/types"


export function CategoriesTable() {
  const t = useTranslations("dashboard.categories")
  const tc = useTranslations("dashboard.common")
  const tg = useTranslations("common")
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data: result, isLoading, isError } = useCategories({ search, status: statusFilter, page })
  const deleteCategory = useDeleteCategory()

  const categories = result?.data ?? []
  const totalPages = Math.ceil((result?.total ?? 0) / PAGE_SIZE)


  function handleDelete() {
    if (!deleteTarget) return
    deleteCategory.mutate(deleteTarget.id, {
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
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter((v ?? "all") as typeof statusFilter); setPage(1) }}
        >
          <SelectTrigger className="w-36">
            <SelectValue displayValue={tc(statusFilter === "all" ? "allStatus" : statusFilter)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("allStatus")}</SelectItem>
            <SelectItem value="active">{tc("active")}</SelectItem>
            <SelectItem value="inactive">{tc("inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto" dir="ltr">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tc("colId")}</TableHead>
              <TableHead>{t("colName")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead>{t("colProducts")}</TableHead>
              <TableHead>{t("colViews")}</TableHead>
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
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  {tc("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {c.id}
                    </code>
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>
                      {c.status === "active" ? tc("active") : tc("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.products_count}</TableCell>
                  <TableCell>{c.views}</TableCell>
                  <TableCell>{formatDate(c.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/categories/${c.id}` as "/dashboard")}>
                          {tc("view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/categories/${c.id}/edit` as "/dashboard")}>
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
              disabled={deleteCategory.isPending}
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
