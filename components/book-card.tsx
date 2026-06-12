import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface BookCardProps {
  book: {
    id?: string;
    key?: string;
    title: string
    author_name?: string[]
    first_publish_year?: number
    cover_i?: number
    edition_count?: number
    ia?: string[]
    public_scan_b?: boolean
    isbn?: string[]
  }
}

export function BookCard({ book }: BookCardProps) {
  const workId = (book.key || book.id || '').replace('/works/', '')
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null
  
  const isReadable = book.ia && book.ia.length > 0 && book.public_scan_b === true
  const iaId = isReadable ? book.ia![0] : null
  const isbn = book.isbn && book.isbn.length > 0 ? book.isbn[0] : null
  
  // Build URL with both IA ID and ISBN for maximum compatibility
  const params = new URLSearchParams()
  if (iaId) params.set('ia', iaId)
  if (isbn) params.set('isbn', isbn)
  
  const bookUrl = `/book/${workId}${params.toString() ? `?${params.toString()}` : ''}`

  return (
    <Link href={bookUrl}>
      <Card className="group cursor-pointer rounded-[14px] border border-[#ebebeb] bg-white p-4 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
        <CardContent className="p-0 space-y-3">
          <div className="aspect-[3/4] relative overflow-hidden rounded-[14px] bg-[#f7f7f7]">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-[#929292] text-sm">No Cover</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2 text-sm leading-snug flex-1 text-[#222222]">
                {book.title}
              </h3>
              {isReadable && (
                <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-green-600 mt-1.5" />
              )}
            </div>
            
            {book.author_name && (
              <p className="text-xs text-[#929292] line-clamp-1">
                {book.author_name.join(", ")}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-[#929292]">
              {book.first_publish_year && (
                <span>{book.first_publish_year}</span>
              )}
              {book.edition_count && book.edition_count > 1 && (
                <span>{book.edition_count} editions</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
