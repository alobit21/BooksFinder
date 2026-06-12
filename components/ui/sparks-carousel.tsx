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
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-play functionality
  React.useEffect(() => {
    if (isPaused || items.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current && !isAtEnd) {
        scroll("right");
      } else if (carouselRef.current && isAtEnd) {
        // Reset to beginning when reaching the end
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3000); // Auto-play every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused, isAtEnd, items.length]);

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
    <section ref={ref} className="w-full py-16" aria-labelledby="sparks-title">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 id="sparks-title" className="text-[20px] font-semibold text-[#222222] tracking-[-0.44px]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[#6a6a6a]">{subtitle}</p>
          </div>
        </div>

        {/* Carousel Section */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={carouselRef}
            className="flex w-full gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((book, index) => {
              const workId = (book.key || book.id || '').replace('/works/', '')
              const coverUrl = book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : null
              
              const isReadable = book.ia && book.ia.length > 0 && book.public_scan_b === true
              const iaId = isReadable ? book.ia![0] : null
              const isbn = book.isbn && book.isbn.length > 0 ? book.isbn[0] : null
              
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
                    <div className="rounded-[14px] border border-[#ebebeb] bg-white p-4 transition-all duration-300 cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
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
                      
                      <div className="p-3 space-y-2 pt-3">
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
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-[#ebebeb] shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04)] transition-opacity hover:bg-[#f7f7f7]"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-[#222222]" />
            </button>
          )}
          {!isAtEnd && (
            <button
              onClick={() => scroll("right")}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-[#ebebeb] shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04)] transition-opacity hover:bg-[#f7f7f7]"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-[#222222]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

SparksCarousel.displayName = "SparksCarousel";
