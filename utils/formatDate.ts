const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

const DATE_SHORT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", DATE_OPTIONS)
}

// Short date without time — e.g. "15 Jan 2024"
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-EG", DATE_SHORT_OPTIONS)
}
