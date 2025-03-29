"use client"

import { useRef, useState } from "react"
import { MovieCard } from "@/components/movie-card"
import { TvShowCard } from "@/components/tv-show-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MediaCarouselProps {
  items: any[]
  genres: {
    id: number
    name: string
  }[]
  type: "movie" | "tv"
  title?: string
  viewAllLink?: string
  featuredIndex?: number
}

export function MediaCarousel({ items, genres, type, title, viewAllLink, featuredIndex = -1 }: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.clientWidth * 0.75 : current.clientWidth * 0.75

      current.scrollBy({ left: scrollAmount, behavior: "smooth" })

      // Check scroll position after animation
      setTimeout(() => {
        if (current) {
          setShowLeftButton(current.scrollLeft > 0)
          setShowRightButton(current.scrollLeft < current.scrollWidth - current.clientWidth - 10)
        }
      }, 400)
    }
  }

  // Handle scroll events to update button visibility
  const handleScroll = () => {
    if (carouselRef.current) {
      const { current } = carouselRef
      setShowLeftButton(current.scrollLeft > 0)
      setShowRightButton(current.scrollLeft < current.scrollWidth - current.clientWidth - 10)
    }
  }

  // Featured item (if specified)
  const featuredItem = featuredIndex >= 0 && featuredIndex < items.length ? items[featuredIndex] : null
  const regularItems = featuredItem ? items.filter((_, index) => index !== featuredIndex) : items

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          {viewAllLink && (
            <Button variant="link" asChild>
              <a href={viewAllLink}>View All</a>
            </Button>
          )}
        </div>
      )}

      {/* Featured item */}
      {featuredItem && (
        <div className="mb-6">
          {type === "movie" ? (
            <MovieCard movie={featuredItem} genres={genres} variant="featured" />
          ) : (
            <TvShowCard show={featuredItem} genres={genres} variant="featured" />
          )}
        </div>
      )}

      <div className="relative group">
        <AnimatePresence>
          {showLeftButton && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-0 bottom-0 flex items-center z-10"
            >
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-white/10 shadow-lg"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          {regularItems.map((item, index) => (
            <div
              key={item.id}
              className="flex-none w-[180px] sm:w-[200px] md:w-[240px] snap-start"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {type === "movie" ? (
                <MovieCard movie={item} genres={genres} />
              ) : (
                <TvShowCard show={item} genres={genres} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showRightButton && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 bottom-0 flex items-center z-10"
            >
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-white/10 shadow-lg"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

