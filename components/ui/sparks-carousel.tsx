import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

// Define book type for carousel items
export interface BookItem {
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

// Define props for main component
export interface SparksCarouselProps {
  title: string;
  subtitle: string;
  items: BookItem[];
}

export const SparksCarousel = React.forwardRef<
  HTMLDivElement,
  SparksCarouselProps
>(({ title, subtitle, items }, ref) => {
  const controls = useAnimation();
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = React.useState(true);
  const [isAtEnd, setIsAtEnd] = React.useState(false);

  // Function to scroll carousel
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll by 80% of visible width
      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  // Effect to check scroll position and update button states
  React.useEffect(() => {
    const checkScrollPosition = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setIsAtStart(scrollLeft < 10);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
      }
    };

    const currentRef = carouselRef.current;
    if (currentRef) {
      // Initial check
      checkScrollPosition();
      currentRef.addEventListener("scroll", checkScrollPosition);
    }

    // Check again on window resize
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollPosition);
      }
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [items]);

  return (
    <section ref={ref} className="w-full py-8" aria-labelledby="sparks-title">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 id="sparks-title" className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex w-full space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {items.map((book, index) => {
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
                <motion.div
                  key={book.id || book.key || index}
                  className="group w-[280px] flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={bookUrl}>
                    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
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
                      
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-2 text-sm leading-tight flex-1 text-foreground">
                            {book.title}
                          </h3>
                          {isReadable && (
                            <Badge variant="default" className="text-xs shrink-0 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
                              Full Text
                            </Badge>
                          )}
                        </div>
                        
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
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          {!isAtStart && (
            <button
              onClick={() => scroll("left")}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 backdrop-blur-sm border text-foreground shadow-md transition-opacity hover:bg-background/80 disabled:opacity-0"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {!isAtEnd && (
            <button
              onClick={() => scroll("right")}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 backdrop-blur-sm border text-foreground shadow-md transition-opacity hover:bg-background/80 disabled:opacity-0"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

SparksCarousel.displayName = "SparksCarousel";
