export function getDiscountedPrice(price: number, discountPercentage: number): number {
  return Math.round(price * (1 - discountPercentage / 100))
}
