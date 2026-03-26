import crypto from "crypto"

const HMAC_FIELDS = [
  "amount_cents", "created_at", "currency", "error_occured",
  "has_parent_transaction", "id", "integration_id", "is_3d_secure",
  "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
  "is_voided", "order", "owner", "pending",
  "source_data.pan", "source_data.sub_type", "source_data.type",
  "success",
]

export function verifyPaymobHmac(
  getValue: (key: string) => string,
  secret: string
): boolean {
  const message = HMAC_FIELDS.map(getValue).join("")
  const hmac = crypto.createHmac("sha512", secret).update(message).digest("hex")
  return hmac === getValue("hmac")
}
