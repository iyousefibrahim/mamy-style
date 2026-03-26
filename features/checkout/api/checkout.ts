import { createClient } from "@/lib/supabase/client"
import type { Order, OrderItem, PaymentMethod, ShippingType } from "@/features/dashboard/types"
import type { CartItemWithProduct } from "@/features/cart/hooks/useCartPage"
import { getDiscountedPrice } from "@/lib/pricing"

type CreateOrderPayload = {
  governorate: string
  city: string
  address_line: string
  phone: string
  subtotal: number
  discount: number
  shipping_fee: number
  total: number
  shipping_type: ShippingType
  payment_method: PaymentMethod
  coupon_code: string | null
  items: CartItemWithProduct[]
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: payload.payment_method === "cod" ? "confirmed" : "pending_payment",
      governorate: payload.governorate,
      city: payload.city,
      address_line: payload.address_line,
      phone: payload.phone,
      subtotal: payload.subtotal,
      discount: payload.discount,
      shipping_fee: payload.shipping_fee,
      total: payload.total,
      shipping_type: payload.shipping_type,
      payment_method: payload.payment_method,
      coupon_code: payload.coupon_code,
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems: Omit<OrderItem, "id">[] = payload.items
    .filter((item) => item.product !== null)
    .map((item) => {
      const product = item.product!
      const price = getDiscountedPrice(product.price, product.discount_percentage)
      return {
        order_id: order.id,
        product_id: product.id,
        name: product.name,
        price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image_url: product.image_url,
      }
    })

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order as Order
}
