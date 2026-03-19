"use client"

import { useState, useEffect, useCallback } from "react";
import { searchBooks } from "../lib/openlibrary";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BookCard } from "@/components/book-card";
import { LoadingGrid } from "@/components/loading-skeleton";
import { EmptyState, InitialEmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadMore } from "@/components/load-more";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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
        
        const data = await searchBooks(searchQuery, pageNum, 20);
        
        if (isLoadMore) {
          setBooks(prev => [...prev, ...data.docs]);
        } else {
          setBooks(data.docs);
        }
        
        setHasSearched(true);
        setHasMore(data.docs.length === 20);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setHasSearched(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
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
        
        <section className="container mx-auto px-4 py-8">
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
                <h2 className="text-2xl font-semibold">
                  {query && `Results for "${query}"`}
                </h2>
                <p className="text-muted-foreground">
                  {books.length} books found
                </p>
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