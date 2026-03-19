"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, BookOpen, Trash2, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface UserBookCardProps {
  book: {
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
  onDelete?: () => void
}

export function UserBookCard({ book, onDelete }: UserBookCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this book?")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete?.()
      } else {
        alert("Failed to delete book")
      }
    } catch (error) {
      alert("An error occurred while deleting the book")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2 text-sm leading-tight flex-1">
                {book.title}
              </h3>
              <div className="flex items-center gap-1">
                {book.isPublic && (
                  <Badge variant="secondary" className="text-xs">
                    Public
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/my-book/${book.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/edit/${book.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {book.author && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.author}
              </p>
            )}
            
            {book.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {book.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {book.fileType.toUpperCase()}
              </Badge>
              <span>{formatFileSize(book.fileSize)}</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Added {formatDate(book.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
