"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface PersonCardProps {
  person: {
    id: number
    name: string
    profile_path: string | null
    known_for_department?: string
    known_for?: any[]
  }
}

export function PersonCard({ person }: PersonCardProps) {
  const [imageError, setImageError] = useState(false)

  // Get the most popular known for title
  const knownForTitle = person.known_for?.[0]?.title || person.known_for?.[0]?.name || person.known_for_department || ""

  return (
    <Link href={`/person/${person.id}`}>
      <Card className="overflow-hidden h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
        <div className="relative aspect-[2/3] bg-muted">
          {person.profile_path && !imageError ? (
            <Image
              src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
              alt={person.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <span className="text-muted-foreground">{person.name}</span>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium line-clamp-1">{person.name}</h3>
          {knownForTitle && <p className="text-xs text-muted-foreground line-clamp-1">{knownForTitle}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}

