"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface GoogleBooksViewerProps {
  isbn?: string
  title?: string
  author?: string
  className?: string
}

export function GoogleBooksViewer({ isbn, title, author, className }: GoogleBooksViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const viewerInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Show loading message immediately
    showLoadingMessage()
    
    // Load Google Books API script
    const script = document.createElement('script')
    script.src = 'https://www.google.com/books/jsapi.js'
    script.async = true
    script.onload = initializeViewer
    script.onerror = () => {
      console.error('Failed to load Google Books API script')
      showFallbackMessage()
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (viewerInstanceRef.current && (isbn || title)) {
      loadBook()
    }
  }, [isbn, title, author])

  const initializeViewer = () => {
    if (typeof window !== 'undefined' && window.google?.books) {
      window.google.books.load()
      
      window.google.books.setOnLoadCallback(() => {
        if (viewerRef.current && window.google?.books?.DefaultViewer) {
          viewerInstanceRef.current = new window.google.books.DefaultViewer(viewerRef.current)
          console.log('Google Books viewer initialized, loading book...')
          loadBook()
        }
      })
    } else {
      console.warn('Google Books API not loaded')
      showFallbackMessage()
    }
  }

  const loadBook = () => {
    if (!viewerInstanceRef.current) return

    let identifier = ""
    
    // Always try to load something, even with minimal info
    if (isbn) {
      identifier = `ISBN:${isbn}`
      console.log('Loading Google Book with ISBN:', identifier)
    } else if (title) {
      // Try title only first
      identifier = title
      console.log('Loading Google Book with title:', identifier)
    } else if (author) {
      // Fall back to author only
      identifier = author
      console.log('Loading Google Book with author:', identifier)
    } else {
      // Last resort - show search interface
      identifier = "books"
      console.log('Loading Google Books search interface')
    }

    if (identifier) {
      viewerInstanceRef.current.load(identifier, () => {
        console.log('Google Books viewer loaded successfully')
      }, (error: any) => {
        console.warn('Failed to load book in Google Books viewer:', error)
        // Try a more generic search as fallback
        if (isbn && identifier !== `ISBN:${isbn}`) {
          console.log('Retrying with ISBN format...')
          loadBookWithISBN()
        } else if (title && identifier !== title) {
          console.log('Retrying with title...')
          loadBookWithTitle()
        } else {
          showFallbackMessage()
        }
      })
    } else {
      console.warn('No identifier available for Google Books viewer')
      showFallbackMessage()
    }
  }

  const loadBookWithISBN = () => {
    if (!viewerInstanceRef.current || !isbn) return
    const identifier = `ISBN:${isbn}`
    viewerInstanceRef.current.load(identifier, () => {
      console.log('Google Books viewer loaded with ISBN fallback')
    }, (error: any) => {
      console.warn('ISBN fallback also failed:', error)
      showFallbackMessage()
    })
  }

  const loadBookWithTitle = () => {
    if (!viewerInstanceRef.current || !title) return
    const query = title + (author ? ` ${author}` : "")
    viewerInstanceRef.current.load(query, () => {
      console.log('Google Books viewer loaded with title fallback')
    }, (error: any) => {
      console.warn('Title fallback also failed:', error)
      showFallbackMessage()
    })
  }

  const showFallbackMessage = () => {
    if (viewerRef.current) {
      viewerRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full p-8 text-center">
          <div class="max-w-md">
            <div class="mb-4">
              <svg class="w-12 h-12 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <p class="text-muted-foreground mb-2">
              This specific book isn't available in Google Books preview.
            </p>
            <p class="text-sm text-muted-foreground mb-4">
              But don't worry! Check the "Alternative Reading Options" section below for more ways to read this book.
            </p>
            ${isbn ? `<p class="text-xs text-muted-foreground">ISBN: ${isbn}</p>` : ''}
            ${title ? `<p class="text-xs text-muted-foreground">Try searching: "${title}"</p>` : ''}
          </div>
        </div>
      `
    }
  }

  const showLoadingMessage = () => {
    if (viewerRef.current) {
      viewerRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full p-8 text-center">
          <div class="max-w-md">
            <div class="mb-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
            <p class="text-muted-foreground">
              Loading Google Books viewer...
            </p>
          </div>
        </div>
      `
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div 
          ref={viewerRef} 
          className="w-full h-[600px] rounded-xl"
          style={{ minHeight: '600px' }}
        />
      </CardContent>
    </Card>
  )
}

// Add TypeScript declarations for Google Books API
declare global {
  interface Window {
    google?: {
      books?: {
        load: (options?: { language?: string }) => void
        setOnLoadCallback: (callback: () => void) => void
        DefaultViewer: new (container: HTMLElement) => {
          load: (identifier: string, successCallback?: () => void, errorCallback?: (error: any) => void) => void
        }
      }
    }
  }
}
