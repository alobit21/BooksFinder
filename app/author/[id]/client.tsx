"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Book, Calendar } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface AuthorDetailsClientProps {
  author: {
    name: string
    bio?: string | { value: string }
    birth_date?: string
    death_date?: string
    photos?: number[]
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
  works: Array<{
    key: string
    title: string
    first_publish_year?: number
    cover_i?: number
    edition_count?: number
    author_key?: string[]
    author_name?: string[]
    ia?: string[]
    public_scan_b?: boolean
  }>
}

export function AuthorDetailsClient({ author, works }: AuthorDetailsClientProps) {
  const bio = typeof author.bio === 'string' 
    ? author.bio 
    : author.bio?.value || 'No biography available'
  
  const photoId = author.photos?.[0]
  const photoUrl = photoId 
    ? `https://covers.openlibrary.org/a/id/${photoId}-L.jpg`
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: "Books", href: "/" },
          { label: author.name }
        ]} />

        {/* Back Navigation */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Author Photo */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Author Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                {author.birth_date && (
                  <p className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Born: {author.birth_date}
                  </p>
                )}
                {author.death_date && (
                  <p className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Died: {author.death_date}
                  </p>
                )}
              </div>
            </div>

            {/* Biography */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Biography</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {bio}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Works */}
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Works ({works.length})
              </h2>
              
              {works.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {works.filter(work => 
                    work?.key && 
                    work.ia && 
                    work.ia.length > 0 && 
                    work.public_scan_b === true
                  ).map((work) => {
                    const workId = work.key.replace('/works/', '')
                    const iaId = work.ia![0] // Safe because we filtered for ia.length > 0
                    const bookUrl = `/book/${workId}?ia=${iaId}`
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
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No works found for this author.
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Author Details</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Key: {author.key}</p>
                    {author.id && <p>ID: {author.id}</p>}
                    {author.type && <p>Type: {author.type.key}</p>}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Revision Info</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {author.revision && <p>Revision: {author.revision}</p>}
                    {author.latest_revision && <p>Latest: {author.latest_revision}</p>}
                    {author.created?.value && <p>Created: {new Date(author.created.value).toLocaleDateString()}</p>}
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
