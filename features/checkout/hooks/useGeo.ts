import { useMemo } from "react"
import {
  governorates,
  getCities,
  LOCAL_SHIPPING_FEE,
  NATIONAL_SHIPPING_FEE,
  type City,
} from "@/lib/geo/egypt"

export { governorates }

export function useGeo(governorateId: number | null, cityId: number | null) {
  const availableCities = useMemo(
    () => (governorateId ? getCities(governorateId) : []),
    [governorateId]
  )

  const selectedCity: City | null = useMemo(
    () => availableCities.find((c) => c.id === cityId) ?? null,
    [availableCities, cityId]
  )

  const isLocalDelivery = selectedCity?.is_local_delivery ?? false
  const shippingFee = selectedCity
    ? isLocalDelivery
      ? LOCAL_SHIPPING_FEE
      : NATIONAL_SHIPPING_FEE
    : null

  return { availableCities, selectedCity, isLocalDelivery, shippingFee }
}
