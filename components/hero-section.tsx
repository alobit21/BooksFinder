"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeroSectionProps {
  query: string
  setQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
  loading: boolean
}

export function HeroSection({ query, setQuery, onSearch, loading }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Discover Your Next Great Read
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search through millions of books from Open Library's extensive collection
          </p>
        </div>

        <form onSubmit={onSearch} className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
              type="text"
              placeholder="Search for books, authors, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-24 h-14 text-lg rounded-full border-2 transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/20"
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
              disabled={loading || !query.trim()}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <span>Popular searches:</span>
          {["Harry Potter", "Classic Literature", "Science Fiction", "Mystery"].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
