"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { mockUsers } from "@/lib/mock/users"

export function UsersTable() {
  const t = useTranslations("dashboard.users")
  const tc = useTranslations("dashboard.common")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const filtered = mockUsers.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || u.status === statusFilter
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB")
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  }

  function getRoleLabel(role: string) {
    if (role === "super-admin") return tc("superAdmin")
    if (role === "admin") return tc("admin")
    return tc("customer")
  }

  function coming() {
    toast.info(t("comingSoon"))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
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
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "all")}>
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
              <TableHead>{t("colCreatedAt")}</TableHead>
              <TableHead>{t("colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {u.id}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(u.full_name)}
                      </AvatarFallback>
                    </Avatar>
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
                <TableCell>{formatDate(u.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Button variant="outline" size="sm" onClick={coming}>
                      {t("ban")}
                    </Button>
                    {u.role === "admin" || u.role === "super-admin" ? (
                      <Button variant="outline" size="sm" onClick={coming}>
                        {t("removeAdmin")}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={coming}>
                        {t("makeAdmin")}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={coming}>
                      {t("deactivate")}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={coming}>
                      {tc("delete")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
