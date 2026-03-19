import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface BookCardProps {
  book: {
    key: string
    title: string
    author_name?: string[]
    first_publish_year?: number
    cover_i?: number
    edition_count?: number
  }
}

export function BookCard({ book }: BookCardProps) {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground text-sm">No Cover</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold line-clamp-2 text-sm leading-tight">
              {book.title}
            </h3>
            
            {book.author_name && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.author_name.join(", ")}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {book.first_publish_year && (
                <span>{book.first_publish_year}</span>
              )}
              {book.edition_count && book.edition_count > 1 && (
                <span>{book.edition_count} editions</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
