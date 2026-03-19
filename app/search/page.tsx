"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search as SearchIcon } from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author?: string | null
  description?: string | null
  fileUrl: string
  coverUrl?: string | null
  isPublic: boolean
  fileType: string
  fileSize: number
  createdAt: Date
}

export default function SearchPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allBooks, setAllBooks] = useState<Book[]>([])

  useEffect(() => {
    // Fetch all public books for search
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books/search")
      if (response.ok) {
        const books = await response.json()
        setAllBooks(books)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const filtered = allBooks.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setSearchResults(filtered)
  }, [searchQuery, allBooks])

  const handleReadBook = (book: Book) => {
    if (session) {
      window.location.href = `/my-book/${book.id}`
    } else {
      window.location.href = `/auth/signin?callbackUrl=/my-book/${book.id}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Books</h1>
          <p className="text-gray-600 mt-2">
            Search through your uploaded book collection
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found {searchResults.length} {searchResults.length === 1 ? 'book' : 'books'}
            </p>
          </div>
        )}

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-4 flex-1">
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      {book.author && (
                        <CardDescription className="text-sm">
                          by {book.author}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {book.description}
                    </p>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {book.fileType.toUpperCase()} • {Math.round(book.fileSize / 1024 / 1024)} MB
                    </span>
                    <Button
                      onClick={() => handleReadBook(book)}
                      size="sm"
                    >
                      Read Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Start typing to search through your uploaded books
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
