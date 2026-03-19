"use client"

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { searchBooks } from "../lib/openlibrary";
import { HeroSection } from "@/components/hero-section";
import { BookCard } from "@/components/book-card";
import { LoadingGrid } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadMore } from "@/components/load-more";
import { SparksCarousel } from "@/components/ui/sparks-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter } from "lucide-react";

interface Book {
  id?: string;
  key?: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  ia?: string[];
  public_scan_b?: boolean;
  isbn?: string[];
}

export default function Home() {
  const searchParams = useSearchParams();
  const externalQuery = searchParams.get('q'); // Handle external search queries
  const [query, setQuery] = useState(externalQuery || "");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(!!externalQuery);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showOnlyReadable, setShowOnlyReadable] = useState(false)
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])

  // Fetch featured books on component mount
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const popularSearches = ["Harry Potter", "Classic Literature", "Science Fiction", "Mystery"]
        const allFeaturedBooks = []
        
        // Fetch books from each popular search (2 books per category = 8 total)
        for (const search of popularSearches) {
          const results = await searchBooks(search, 1, 2)
          if (results.docs && results.docs.length > 0) {
            allFeaturedBooks.push(...results.docs.slice(0, 2))
          }
        }
        
        // Shuffle the books to mix categories
        const shuffled = allFeaturedBooks.sort(() => Math.random() - 0.5)
        setFeaturedBooks(shuffled.slice(0, 8))
      } catch (error) {
        console.error("Failed to fetch featured books:", error)
        // Fallback to generic popular search
        try {
          const featured = await searchBooks("popular", 1, 8)
          setFeaturedBooks(featured.docs.slice(0, 8))
        } catch (fallbackError) {
          console.error("Fallback search failed:", fallbackError)
        }
      }
    }
    fetchFeaturedBooks()
  }, []);

  const debouncedSearch = useCallback(
    async (searchQuery: string, pageNum: number = 1, isLoadMore: boolean = false) => {
      if (!searchQuery.trim()) return;
      
      try {
        if (!isLoadMore) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }
        
        // Search OpenLibrary API
        const searchResults = await searchBooks(searchQuery, pageNum, 20);
        let filteredBooks = searchResults.docs || [];
        
        // Apply readability filter if enabled
        if (showOnlyReadable) {
          filteredBooks = filteredBooks.filter((book: Book) => 
            book.ia && book.ia.length > 0 && book.public_scan_b === true
          );
        }
        
        // Sort to put IA books first (prioritize books with Internet Archive IDs)
        filteredBooks = filteredBooks.sort((a: Book, b: Book) => {
          const aHasIA = a.ia && a.ia.length > 0 && a.public_scan_b === true ? 1 : 0;
          const bHasIA = b.ia && b.ia.length > 0 && b.public_scan_b === true ? 1 : 0;
          
          if (aHasIA !== bHasIA) {
            return bHasIA - aHasIA;
          }
          
          return 0;
        });
        
        if (isLoadMore) {
          setBooks(prev => [...prev, ...filteredBooks]);
        } else {
          setBooks(filteredBooks);
        }
        
        setHasSearched(true);
        setHasMore(searchResults.docs && searchResults.docs.length === 20);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setHasSearched(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [showOnlyReadable]
  );

  const handleDirectSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery, 1, false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await debouncedSearch(query.trim(), 1, false);
    }
  };

  const handleLoadMore = () => {
    if (query.trim() && hasMore && !loadingMore) {
      debouncedSearch(query.trim(), page + 1, true);
    }
  };

  const handleRetry = () => {
    if (query.trim()) {
      debouncedSearch(query.trim(), 1, false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection 
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          onDirectSearch={handleDirectSearch}
          loading={loading}
        />
        
        {/* Search Results Section */}
        <section className="mb-12 px-4 sm:px-6 lg:px-8">
          {loading && !books.length && <LoadingGrid />}
          
          {error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}
          
          {!loading && !error && hasSearched && books.length === 0 && (
            <EmptyState />
          )}
          
          {books.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 p-6 bg-card rounded-lg border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {query && `Results for "${query}"`}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {books.length} books found
                      {!showOnlyReadable && (
                        <span className="text-sm ml-2">
                          (Books with full text shown first)
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Badge variant="default" className="bg-green-600 text-xs">Full Text</Badge>
                        <span className="text-muted-foreground">Complete reading via Internet Archive</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Badge variant="default" className="bg-blue-600 text-xs">Preview</Badge>
                        <span className="text-muted-foreground">Preview via external links</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-foreground" />
                    <Button
                      variant={showOnlyReadable ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowOnlyReadable(!showOnlyReadable)}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      {showOnlyReadable ? "All Books" : "Readable Only"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id || book.key} book={book} />
                ))}
              </div>
              
              <LoadMore 
                onLoadMore={handleLoadMore}
                loading={loadingMore}
                hasMore={hasMore}
              />
            </div>
          )}
        </section>

        {/* Featured Books Carousel */}
        {featuredBooks.length > 0 && !hasSearched && (
          <section className="mb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Featured Books
                </h2>
                <p className="text-muted-foreground">
                  Discover popular books from our collection
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {featuredBooks.map((book) => (
                  <BookCard key={book.id || book.key} book={book} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}