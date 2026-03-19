"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DottedSurfaceThree } from "@/components/ui/dotted-surface-three"

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
    <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background via-background to-muted/20 dark:bg-gradient-to-br dark:from-background dark:via-background dark:to-muted/20 overflow-hidden">
      
      {/* ✅ New Background */}
      <DottedSurfaceThree className="absolute inset-0 z-0" />

<div className="absolute inset-0 z-[1] bg-white/60 dark:bg-black/30 backdrop-blur-[1px]" />

<div className="container mx-auto max-w-4xl relative z-10"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Discover Your Next Great Read
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isExternalSearch
              ? "Found through external platforms - search for more books in our system"
              : "Search through millions of books from Open Library's extensive collection"}
          </p>
        </div>

        <form onSubmit={onSearch} className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-foreground" />

            <Input
              type="text"
              placeholder="Search for books, authors, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-24 h-14 text-lg rounded-full border-2 transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />

            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
              disabled={loading || !query.trim()}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-3">
            Popular searches:
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { term: "Harry Potter", color: "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300" },
              { term: "Classic Literature", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300" },
              { term: "Science Fiction", color: "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300" },
              { term: "Mystery", color: "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300" }
            ].map(({ term, color }) => (
              <Badge
                key={term}
                variant="secondary"
                className={`cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1 ${color}`}
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