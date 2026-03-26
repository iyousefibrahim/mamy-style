type PaymobItem = {
  name: string
  amount_cents: number
  description: string
  quantity: number
}

type PaymobBilling = {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  street: string
  city: string
  state: string
  country: string
  apartment: string
  floor: string
  building: string
  postal_code: string
}

type InitiatePayload = {
  orderId: string
  amountPiasters: number
  locale: string
  billing: PaymobBilling
  items: PaymobItem[]
}

export async function redirectToPaymob(payload: InitiatePayload): Promise<void> {
  const res = await fetch("/api/checkout/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error ?? "Failed to initiate payment")
  }

  const { paymentToken, iframeId } = await res.json()
  window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`
}
