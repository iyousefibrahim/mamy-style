const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", DATE_OPTIONS)
}
