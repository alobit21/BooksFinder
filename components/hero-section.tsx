"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  query: string
  setQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
  onDirectSearch?: (query: string) => void
  loading?: boolean
  isExternalSearch?: boolean
}

export function HeroSection({
  query,
  setQuery,
  onSearch,
  onDirectSearch,
  loading,
  isExternalSearch = false,
}: HeroSectionProps) {
  return (
    <section className="relative bg-white py-24 px-4 text-center overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="mb-10">
          <h1 className="text-[28px] md:text-[28px] font-semibold leading-snug text-[#222222] mb-4 tracking-[-0.44px] max-w-2xl mx-auto">
            {isExternalSearch
              ? "Found Through External Sources"
              : "Discover Your Next Great Read"}
          </h1>

          <p className="text-base font-normal leading-relaxed text-[#6a6a6a] max-w-2xl mx-auto">
            {isExternalSearch
              ? "Found through external platforms - search for more books in our system"
              : "Search through millions of books from Open Library's extensive collection"}
          </p>
        </div>

        <form onSubmit={onSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6a6a6a] transition-colors group-focus-within:text-[#222222]" />

            <Input
              type="text"
              placeholder="Search for books, authors, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-24 h-16 text-base rounded-full border border-[#dddddd] transition-all duration-300 focus:border-[#222222] text-[#222222] placeholder:text-[#929292]"
              disabled={loading}
            />

            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-full h-12 px-5 text-sm font-medium"
              disabled={loading || !query.trim()}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div>
          <p className="text-sm text-[#6a6a6a] mb-3">
            Popular searches:
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { term: "Harry Potter" },
              { term: "Classic Literature" },
              { term: "Science Fiction" },
              { term: "Mystery" }
            ].map(({ term }) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer transition-all duration-200 hover:bg-[#f2f2f2] text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] hover:border-[#dddddd]"
                onClick={() => onDirectSearch?.(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}