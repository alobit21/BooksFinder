"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Book, Tag } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface SubjectClientProps {
  subjectName: string
  data: {
    name?: string
    display_name?: string
    key?: string
    subject_type?: string
    work_count?: number
    works?: Array<{
      key: string
      title: string
      first_publish_year?: number
      cover_i?: number
      edition_count?: number
      author_key?: string[]
      author_name?: string[]
      ia?: string[]
      public_scan_b?: boolean
      isbn?: string[]
    }>
  }
}

export function SubjectClient({ subjectName, data }: SubjectClientProps) {
  const works = data.works || []
  const displayName = data.display_name || data.name || subjectName
  const workCount = data.work_count || works.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: "Books", href: "/" },
          { label: "Subjects", href: "/" },
          { label: displayName }
        ]} />

        {/* Back Navigation */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        {/* Subject Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{displayName}</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {workCount} books in this subject
          </p>
          {data.subject_type && (
            <Badge variant="outline" className="mt-2">
              {data.subject_type}
            </Badge>
          )}
        </div>

        {/* Books Grid */}
        {works.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {works.filter(work => 
              work?.key && 
              work.ia && 
              work.ia.length > 0 && 
              work.public_scan_b === true
            ).map((work) => {
              const workId = work.key.replace('/works/', '')
              const iaId = work.ia![0] // Safe because we filtered for ia.length > 0
              const isbn = work.isbn && work.isbn.length > 0 ? work.isbn[0] : null
              
              // Build URL with both IA ID and ISBN
              const params = new URLSearchParams()
              if (iaId) params.set('ia', iaId)
              if (isbn) params.set('isbn', isbn)
              
              const bookUrl = `/book/${workId}${params.toString() ? `?${params.toString()}` : ''}`
              const coverUrl = work.cover_i 
                ? `https://covers.openlibrary.org/b/id/${work.cover_i}-M.jpg`
                : null

              return (
                <Link key={work.key} href={bookUrl}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={work.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Book className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold line-clamp-2 text-sm leading-tight flex-1">
                              {work.title}
                            </h3>
                            <Badge variant="default" className="text-xs shrink-0">
                              Readable
                            </Badge>
                          </div>
                          
                          {work.author_name && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {work.author_name.join(", ")}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            {work.first_publish_year && (
                              <span>{work.first_publish_year}</span>
                            )}
                            {work.edition_count && work.edition_count > 1 && (
                              <span>{work.edition_count} editions</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6">
                There are no books available in this subject category.
              </p>
              <Link href="/">
                <Button>
                  Search for books
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Subject Info */}
        {data.key && (
          <div className="mt-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Subject Details</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Key: {data.key}</p>
                  {data.subject_type && <p>Type: {data.subject_type}</p>}
                  <p>Total works: {workCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
