"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface TvShowCardProps {
  show: {
    id: number
    name: string
    poster_path: string | null
    backdrop_path?: string | null
    vote_average: number
    first_air_date: string
    genre_ids: number[]
    overview?: string
  }
  genres: {
    id: number
    name: string
  }[]
  variant?: "default" | "featured"
}

export function TvShowCard({ show, genres, variant = "default" }: TvShowCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const showGenres = show.genre_ids
    .map((id) => genres.find((genre) => genre.id === id))
    .filter(Boolean)
    .slice(0, 3)

  const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null

  const isFeatured = variant === "featured"

  return (
    <Link href={`/tv/${show.id}`}>
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
            {show.poster_path && !imageError ? (
              <>
                <Image
                  src={`https://image.tmdb.org/t/p/${isFeatured ? "w780" : "w500"}${isFeatured ? show.backdrop_path || show.poster_path : show.poster_path}`}
                  alt={show.name}
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
                <span className="text-muted-foreground">{show.name}</span>
              </div>
            )}

            <div className="absolute top-2 right-2 z-10">
              <Badge className="flex items-center gap-1 bg-black/70 backdrop-blur-sm hover:bg-black/70">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {show.vote_average.toFixed(1)}
              </Badge>
            </div>

            {isFeatured && show.overview && (
              <div
                className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
              >
                <p className="text-white/90 line-clamp-3 text-sm">{show.overview}</p>
              </div>
            )}
          </div>

          <CardContent className={`p-3 ${isFeatured ? "pt-4" : ""}`}>
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{show.name}</h3>

            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-wrap gap-1 mt-1">
                {showGenres.map((genre) => (
                  <Badge key={genre?.id} variant="secondary" className="text-xs">
                    {genre?.name}
                  </Badge>
                ))}
              </div>

              {firstAirYear && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {firstAirYear}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

