"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Info, Star, Calendar } from "lucide-react"
import { TrailerModal } from "@/components/trailer-modal"

interface HeroSectionProps {
  movie: {
    id: number
    title: string
    backdrop_path: string
    overview: string
    release_date: string
    vote_average: number
    genre_ids: number[]
  }
}

export function HeroSection({ movie }: HeroSectionProps) {
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Truncate overview if it's too long
  const truncatedOverview = movie.overview.length > 200 ? `${movie.overview.substring(0, 200)}...` : movie.overview

  return (
    <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      {/* Backdrop image with parallax effect */}
      <div
        className="absolute inset-0 transform scale-110"
        style={{ transform: `translateY(${scrollY * 0.5}px) scale(1.1)` }}
      >
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl animate-fade-up animate-once animate-duration-[800ms] animate-delay-300">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary/80 backdrop-blur-sm hover:bg-primary/90 text-white">Featured</Badge>
            <Badge variant="outline" className="backdrop-blur-sm">
              {new Date(movie.release_date).getFullYear()}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-6 text-white drop-shadow-md">{movie.title}</h1>

          <div className="flex items-center gap-4 mb-4 text-white/90">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1 fill-yellow-400" />
              <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              <span className="text-sm text-white/70 ml-1">/ 10</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 opacity-70" />
              <span>
                {new Date(movie.release_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <p className="text-lg text-white/80 mb-8 hidden md:block leading-relaxed">{truncatedOverview}</p>

          <div className="flex flex-wrap gap-4">
            <Button
              className="gap-2 bg-primary hover:bg-primary/90 text-white"
              size="lg"
              onClick={() => setTrailerOpen(true)}
            >
              <PlayCircle className="h-5 w-5" />
              Watch Trailer
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-black/30 backdrop-blur-sm border-white/20 hover:bg-black/40 text-white"
              asChild
            >
              <Link href={`/movies/${movie.id}`}>
                <Info className="h-5 w-5" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <TrailerModal movieId={movie.id} title={movie.title} isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </div>
  )
}

