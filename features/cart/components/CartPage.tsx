"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart, Package } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";

import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { useCartPage } from "../hooks/useCartPage";

function CartSkeleton() {
  return (
    <div className="flex gap-4 py-5 border-b">
      <Skeleton className="size-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function CartPage() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("dashboard.common");
  const { user, items, isLoading, totalCount, updateQuantity, clearCart } =
    useCartPage();

  // Not logged in
  if (!user) {
    return (
      <AuthGate
        title={t("loginTitle")}
        description={t("loginDesc")}
        loginLabel={t("loginBtn")}
      />
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="wrapper py-8">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartSkeleton key={i} />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Empty
  if (items.length === 0) {
    return (
      <div className="wrapper py-24">
        <EmptyState
          icon={ShoppingCart}
          iconClassName="text-primary/50"
          iconBgClassName="bg-primary/10"
          badgeIcon={Package}
          title={t("empty")}
          description={t("emptyDesc")}
          action={{ label: t("shopNow"), href: "/products" }}
        />
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const price = item.product
      ? Math.round(
          item.product.price * (1 - item.product.discount_percentage / 100),
        )
      : 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="wrapper py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {t("title")} — {t("items", { count: totalCount })}
        </h1>
        <AlertDialog>
          <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md px-3 h-8 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
            {t("clearCart")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("clearCartConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("clearCartConfirmDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                {tCommon("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                onClick={clearCart}
              >
                {t("clearCart")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Items */}
        <div className="md:col-span-2">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQty={updateQuantity}
              onRemove={(id) => updateQuantity(id, 0)}
            />
          ))}
        </div>

        {/* Summary */}
        <div>
          <CartSummary
            subtotal={subtotal}
            hasOutOfStock={items.some(
              (item) => item.product && item.quantity > item.product.stock
            )}
          />
        </div>
      </div>
    </div>
  );
}
