"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  useUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/features/dashboard/hooks/useUsers"
import { getPageItems, PAGE_SIZE } from "@/utils/pagination"


export function UsersTable() {
  const t = useTranslations("dashboard.users")
  const tc = useTranslations("dashboard.common")
  const tg = useTranslations("common")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useUsers({
    search,
    status: statusFilter as "all" | "active" | "inactive" | "banned",
    role: roleFilter as "all" | "super-admin" | "admin" | "customer",
    page,
  })

  const users = result?.data ?? []
  const totalPages = Math.ceil((result?.total ?? 0) / PAGE_SIZE)

  const updateRole = useUpdateUserRole()
  const updateStatus = useUpdateUserStatus()

  function getRoleLabel(role: string) {
    if (role === "super-admin") return tc("superAdmin")
    if (role === "admin") return tc("admin")
    return tc("customer")
  }

  function handleRoleToggle(id: string, role: "super-admin" | "admin" | "customer") {
    const newRole = role === "admin" || role === "super-admin" ? "customer" : "admin"
    updateRole.mutate({ id, role: newRole }, {
      onSuccess: () => toast.success(getRoleLabel(newRole)),
      onError: (err) => toast.error(err.message),
    })
  }

  function handleBan(id: string) {
    updateStatus.mutate({ id, status: "banned" }, {
      onSuccess: () => toast.success(t("ban")),
      onError: (err) => toast.error(err.message),
    })
  }

  function handleDeactivate(id: string) {
    updateStatus.mutate({ id, status: "inactive" }, {
      onSuccess: () => toast.success(t("deactivate")),
      onError: (err) => toast.error(err.message),
    })
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
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("allStatus")}</SelectItem>
            <SelectItem value="active">{tc("active")}</SelectItem>
            <SelectItem value="inactive">{tc("inactive")}</SelectItem>
            <SelectItem value="banned">{tc("banned")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v ?? "all"); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("filterRole")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tc("allStatus")}</SelectItem>
            <SelectItem value="super-admin">{tc("superAdmin")}</SelectItem>
            <SelectItem value="admin">{tc("admin")}</SelectItem>
            <SelectItem value="customer">{tc("customer")}</SelectItem>
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
              <TableHead>{t("colEmail")}</TableHead>
              <TableHead>{t("colUsername")}</TableHead>
              <TableHead>{t("colRole")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead>{t("colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  {tg("loading")}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  {tc("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {u.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{u.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{getRoleLabel(u.role)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.status === "active"
                          ? "default"
                          : u.status === "banned"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {u.status === "active"
                        ? tc("active")
                        : u.status === "banned"
                        ? tc("banned")
                        : tc("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateStatus.isPending}
                        onClick={() => handleBan(u.id)}
                      >
                        {t("ban")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateRole.isPending}
                        onClick={() => handleRoleToggle(u.id, u.role)}
                      >
                        {u.role === "admin" || u.role === "super-admin"
                          ? t("removeAdmin")
                          : t("makeAdmin")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updateStatus.isPending}
                        onClick={() => handleDeactivate(u.id)}
                      >
                        {t("deactivate")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => toast.info(t("comingSoon"))}
                      >
                        {tc("delete")}
                      </Button>
                    </div>
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
    </div>
  )
}
