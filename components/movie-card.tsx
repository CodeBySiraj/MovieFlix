"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
    vote_average: number
    release_date: string
    genre_ids: number[]
    overview?: string
    runtime?: number
  }
  genres: {
    id: number
    name: string
  }[]
  variant?: "default" | "featured"
}

export function MovieCard({ movie, genres, variant = "default" }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const movieGenres = movie.genre_ids
    .map((id) => genres.find((genre) => genre.id === id))
    .filter(Boolean)
    .slice(0, 3)

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null

  const isFeatured = variant === "featured"

  return (
    <Link href={`/movies/${movie.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-full ${isFeatured ? "aspect-[16/9]" : ""}`}
      >
        <Card
          className={`overflow-hidden h-full transition-all duration-300 ${
            isHovered ? "shadow-xl shadow-primary/10" : "shadow-none"
          } border-0 bg-transparent`}
        >
          <div
            className={`relative ${isFeatured ? "aspect-[16/9]" : "aspect-[2/3]"} bg-muted rounded-lg overflow-hidden`}
          >
            {movie.poster_path && !imageError ? (
              <>
                <Image
                  src={`https://image.tmdb.org/t/p/${isFeatured ? "w780" : "w500"}${isFeatured ? movie.backdrop_path || movie.poster_path : movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes={
                    isFeatured
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  }
                  className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
                  onError={() => setImageError(true)}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-70"}`}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-card">
                <span className="text-muted-foreground">{movie.title}</span>
              </div>
            )}

            <div className="absolute top-2 right-2 z-10">
              <Badge className="flex items-center gap-1 bg-black/70 backdrop-blur-sm hover:bg-black/70">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </Badge>
            </div>

            {isFeatured && movie.overview && (
              <div
                className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
              >
                <p className="text-white/90 line-clamp-3 text-sm">{movie.overview}</p>
              </div>
            )}
          </div>

          <CardContent className={`p-3 ${isFeatured ? "pt-4" : ""}`}>
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>

            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-wrap gap-1 mt-1">
                {movieGenres.map((genre) => (
                  <Badge key={genre?.id} variant="secondary" className="text-xs">
                    {genre?.name}
                  </Badge>
                ))}
              </div>

              {releaseYear && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {releaseYear}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

