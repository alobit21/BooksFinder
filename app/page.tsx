"use client"

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { searchBooks } from "../lib/openlibrary";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BookCard } from "@/components/book-card";
import { LoadingGrid } from "@/components/loading-skeleton";
import { EmptyState, InitialEmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadMore } from "@/components/load-more";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter } from "lucide-react";

interface Book {
  key: string;
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
  const [showOnlyReadable, setShowOnlyReadable] = useState(false);

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
        
        // Search through uploaded books API
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`);
        const allBooks = await response.json();
        let filteredBooks = showOnlyReadable 
          ? allBooks.filter((book: Book) => book.ia && book.ia.length > 0 && book.public_scan_b === true)
          : allBooks;
        
        // Sort to put IA books first (prioritize books with Internet Archive IDs)
        filteredBooks = filteredBooks.sort((a: Book, b: Book) => {
          // Books with IA come first
          const aHasIA = a.ia && a.ia.length > 0 && a.public_scan_b === true ? 1 : 0;
          const bHasIA = b.ia && b.ia.length > 0 && b.public_scan_b === true ? 1 : 0;
          
          if (aHasIA !== bHasIA) {
            return bHasIA - aHasIA; // bHasIA first if different
          }
          
          // If both have IA or both don't have IA, maintain original order
          return 0;
        });
        
        if (isLoadMore) {
          setBooks(prev => [...prev, ...filteredBooks]);
        } else {
          setBooks(filteredBooks);
        }
        
        setHasSearched(true);
        setHasMore(filteredBooks.length === 20);
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
      <Header query={query} setQuery={setQuery} onSearch={handleSearch} />
      
      <main>
        <HeroSection 
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />
        
        <section className="mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Your Books</h2>
              <p className="text-gray-600">
                Search through books you've uploaded to your personal library
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your uploaded books..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const query = e.target.value
                    // Navigate to search page with query
                    if (query.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(query)}`
                    }
                  }}
                />
                <Button
                  onClick={() => window.location.href = '/search'}
                  variant="outline"
                  size="sm"
                  className="absolute right-1 top-1/2"
                >
                  Advanced Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          {loading && !books.length && <LoadingGrid />}
          
          {error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}
          
          {!loading && !error && hasSearched && books.length === 0 && (
            <EmptyState />
          )}
          
          {!loading && !error && !hasSearched && (
            <InitialEmptyState />
          )}
          
          {books.length > 0 && (
            <>
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {query && `Results for "${query}"`}
                    </h2>
                    <p className="text-muted-foreground">
                      {books.length} books found
                      {!showOnlyReadable && (
                        <span className="text-sm ml-2">
                          (Books with full text shown first)
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
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
                    <Filter className="h-4 w-4 text-muted-foreground" />
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
                  <BookCard key={book.key} book={book} />
                ))}
              </div>
              
              <LoadMore 
                onLoadMore={handleLoadMore}
                loading={loadingMore}
                hasMore={hasMore}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}