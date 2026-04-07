export function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  if (!domain) return email
  return `${local[0]}***@${domain}`
}
