"use client"

import { Suspense } from "react"
import { SearchContent } from "./search-content"

export function SearchWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
