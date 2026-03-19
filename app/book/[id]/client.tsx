"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Book, User, Tag, Download, ExternalLink } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { SimpleReader } from "@/components/simple-reader"
import { AIReader } from "@/components/ai-reader"

interface BookDetailsClientProps {
  book: {
    title: string
    description?: string | { value: string }
    subjects?: string[]
    covers?: number[]
    authors?: Array<{
      author?: {
        key: string
        name: string
      }
      key?: string
      name?: string
      type?: {
        key: string
      }
    }>
    first_publish_date?: string
    created?: {
      value: string
    }
    latest_revision?: number
    revision?: number
    key: string
    id?: string
    type?: {
      key: string
    }
  }
  iaId?: string
  isbn?: string
}

export function BookDetailsClient({ book, iaId, isbn }: BookDetailsClientProps) {
  const description = typeof book.description === 'string' 
    ? book.description 
    : book.description?.value || 'No description available'
  
  const coverId = book.covers?.[0]
  const coverUrl = coverId 
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null

  const isFallbackData = book.title === `Book ${book.id}` || (
  typeof book.description === 'string' && book.description.includes('temporarily unavailable')
)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: "Books", href: "/" },
          { label: book.title }
        ]} />

        {/* Back Navigation */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        {/* Fallback Data Warning */}
        {isFallbackData && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Book details are temporarily unavailable due to API issues, but you can still read the book if it's available.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Book className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Read/Download Actions */}
            {iaId ? (
              <Card className="mt-4">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Available Actions</h3>
                    
                    <Button className="w-full" asChild>
                      <Link href={`https://archive.org/details/${iaId}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Read Book
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`https://archive.org/download/${iaId}`} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-4">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <Book className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      This book is not available for reading
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">{book.title}</h1>
              {book.first_publish_date && (
                <p className="text-muted-foreground">
                  First published: {book.first_publish_date}
                </p>
              )}
            </div>

            {/* Authors */}
            {book.authors && book.authors.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                  <User className="mr-2 h-5 w-5" />
                  Authors
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.authors?.filter(author => {
                    const authorKey = author.author?.key ?? author.key
                    return authorKey
                  }).map((author) => {
                    const authorKey = author.author?.key ?? author.key
                    const authorName = author.author?.name ?? author.name
                    if (!authorKey) return null
                    
                    const authorId = authorKey.replace('/authors/', '')
                    return (
                      <Link key={authorKey} href={`/author/${authorId}`}>
                        <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          {authorName || 'Unknown Author'}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Subjects */}
            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                  <Tag className="mr-2 h-5 w-5" />
                  Subjects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 20).map((subject) => (
                    <Link key={subject} href={`/subject/${encodeURIComponent(subject.toLowerCase().replace(/\s+/g, '-'))}`}>
                      <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        {subject}
                      </Badge>
                    </Link>
                  ))}
                  {book.subjects.length > 20 && (
                    <Badge variant="outline" className="text-muted-foreground">
                      +{book.subjects.length - 20} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Description</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Embedded Reader */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Read Book</h2>
              
              {/* Internet Archive Reader - Always Show if Available */}
              {iaId && (
                <div className="mb-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">Internet Archive Reader</h3>
                        <Badge variant="outline" className="text-green-600">Full Text</Badge>
                      </div>
                      <iframe
                        src={`https://archive.org/embed/${iaId}`}
                        className="w-full h-[600px] rounded-xl border"
                        allowFullScreen
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* AI Reader - Smart Book Analysis */}
              <AIReader 
                title={book.title}
                author={book.authors?.map(a => a.author?.name || a.name).join(', ')}
                isbn={isbn}
                iaId={iaId}
                className="mb-4"
              />
              
              {/* Simple Reader - Always Available Fallback */}
              <SimpleReader 
                title={book.title}
                author={book.authors?.map(a => a.author?.name || a.name).join(', ')}
                isbn={isbn}
                iaId={iaId}
              />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Book Details</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Key: {book.key}</p>
                    {book.id && <p>ID: {book.id}</p>}
                    {book.type && <p>Type: {book.type.key}</p>}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Revision Info</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {book.revision && <p>Revision: {book.revision}</p>}
                    {book.latest_revision && <p>Latest: {book.latest_revision}</p>}
                    {book.created?.value && <p>Created: {new Date(book.created.value).toLocaleDateString()}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
