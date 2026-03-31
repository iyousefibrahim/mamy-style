"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export function GoToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-4 inset-e-4 sm:bottom-6 sm:inset-e-6 z-40 size-10 sm:size-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      aria-label="Back to top"
    >
      <ChevronUp className="size-5" />
    </button>
  )
}
