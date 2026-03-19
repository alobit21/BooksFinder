import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBookDetails } from "@/lib/openlibrary"
import { BookDetailsClient } from "./client"

interface BookPageProps {
  params: {
    id: string
  }
  searchParams: {
    ia?: string
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    let book
    
    try {
      book = await getBookDetails(id)
    } catch (apiError) {
      // Fallback if API is unavailable
      return {
        title: `Book ${id}`,
        description: "Book details temporarily unavailable due to API issues.",
      }
    }
    
    return {
      title: book.title || "Book Details",
      description: book.description?.value || book.description || `Details about ${book.title}`,
    }
  } catch {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found.",
    }
  }
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  try {
    const { id } = await params
    const { ia } = await searchParams
    
    let book
    try {
      book = await getBookDetails(id)
    } catch (apiError) {
      // If API fails, create a basic book object from the URL params
      console.warn('Open Library API unavailable, using fallback data:', apiError)
      book = {
        title: `Book ${id}`,
        description: 'Book details temporarily unavailable due to API issues.',
        key: `/works/${id}`,
        covers: [],
        authors: [],
        subjects: [],
        first_publish_date: undefined,
        created: undefined,
        latest_revision: undefined,
        revision: undefined,
        id: id,
        type: { key: '/type/work' }
      }
    }
    
    return <BookDetailsClient book={book} iaId={ia} />
  } catch (error) {
    console.error('Critical error in BookPage:', error)
    notFound()
  }
}
