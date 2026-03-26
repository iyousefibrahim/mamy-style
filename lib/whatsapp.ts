import { createClient } from "@/lib/supabase/server"

export async function sendOrderWhatsApp(orderId: string): Promise<void> {
  const phone = process.env.WHATSAPP_OWNER_NUMBER
  const apiKey = process.env.CALLMEBOT_API_KEY
  if (!phone || !apiKey) return

  const supabase = await createClient()
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single()

  if (!order) return

  const itemLines = (order.order_items as { name: string; quantity: number; color: string | null; size: string | null }[])
    .map((i) => {
      const opts = [i.color, i.size].filter(Boolean).join(" · ")
      return `  🔹 ${i.name} × ${i.quantity}${opts ? `  (${opts})` : ""}`
    })
    .join("\n")

  const isCod = order.payment_method === "cod"

  const message = [
    `🛍️ *طلب جديد!*`,
    `━━━━━━━━━━━━━━━━━`,
    `🔑 رقم الطلب: #${order.id.slice(0, 8).toUpperCase()}`,
    ``,
    `📦 *المنتجات:*`,
    itemLines,
    ``,
    `📍 *العنوان:*`,
    `  ${order.address_line}`,
    `  ${order.city}، ${order.governorate}`,
    ``,
    `📞 ${order.phone}`,
    ``,
    `━━━━━━━━━━━━━━━━━`,
    `💰 الإجمالي: *${order.total.toLocaleString()} جنيه*`,
    isCod
      ? `💵 الدفع: *عند الاستلام*`
      : `💳 الدفع: *أونلاين ✅*`,
    `━━━━━━━━━━━━━━━━━`,
  ].join("\n")

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`

  // Fire-and-forget — never block the order flow
  await fetch(url).catch((err) => console.error("[whatsapp] Failed to send notification:", err))
}
