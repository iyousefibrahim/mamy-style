export const PAGE_SIZE = 10

export function paginationRange(page = 1, size = PAGE_SIZE): { from: number; to: number } {
  const from = (page - 1) * size
  return { from, to: from + size - 1 }
}

export function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const items: (number | "ellipsis")[] = [1]
  if (page > 3) items.push("ellipsis")
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) items.push(i)
  if (page < totalPages - 2) items.push("ellipsis")
  items.push(totalPages)
  return items
}
