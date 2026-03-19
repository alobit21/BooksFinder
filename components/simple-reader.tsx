"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SimpleReaderProps {
  title?: string
  author?: string
  isbn?: string
  iaId?: string
  className?: string
}

export function SimpleReader({ title, author, isbn, iaId, className }: SimpleReaderProps) {
  const searchQuery = title || author ? `${title} ${author}`.trim() : ''

  const searchQueries = [
    {
      name: "Internet Archive",
      url: iaId 
        ? `https://archive.org/details/${iaId}`
        : `https://archive.org/search.php?query=${encodeURIComponent(`${title || ''} ${author || ''}`)}`,
      icon: <ExternalLink className="h-4 w-4" />,
      description: "Search on Internet Archive"
    },
    {
      name: "Project Gutenberg",
      url: `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(`${title || ''} ${author || ''}`)}`,
      icon: <BookOpen className="h-4 w-4" />,
      description: "Search free public domain books"
    },
    {
      name: "Open Library",
      url: isbn 
        ? `https://openlibrary.org/isbn/${isbn}`
        : `https://openlibrary.org/search?q=${encodeURIComponent(`${title || ''} ${author || ''}`)}`,
      icon: <Search className="h-4 w-4" />,
      description: "Search on Open Library"
    }
  ]

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Alternative Reading Options</h3>
            <Badge variant="outline">External Links</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Since the embedded readers are currently unavailable, try these external sources to find and read this book.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchQueries.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                asChild
              >
                <a
                  href={query.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    {query.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{query.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {query.description}
                    </div>
                  </div>
                </a>
              </Button>
            ))}
          </div>
          
          {isbn && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>ISBN:</strong> {isbn}
              </p>
            </div>
          )}
          
          {title && (
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href={`/?q=${encodeURIComponent(searchQuery)}`} className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Search for More Books in Our System
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
