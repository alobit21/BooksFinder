"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  query: string
  setQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
}

export function Header({ query, setQuery, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">📚 BooksFinder</h1>
        </div>

        <form onSubmit={onSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for books, authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 rounded-full"
            />
          </div>
        </form>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
