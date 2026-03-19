"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserBookCard } from "@/components/user-book-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  description?: string | null
  fileUrl: string
  coverUrl?: string | null
  author?: string | null
  isPublic: boolean
  fileType: string
  fileSize: number
  createdAt: Date
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const booksData = await response.json()
        setBooks(booksData)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading your library...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal book collection
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't uploaded any books yet. Start building your library!
            </p>
            <Link href="/dashboard/upload">
              <Button>Upload Your First Book</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <UserBookCard 
                key={book.id} 
                book={book} 
                onDelete={() => {
                  setBooks(books.filter(b => b.id !== book.id))
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
