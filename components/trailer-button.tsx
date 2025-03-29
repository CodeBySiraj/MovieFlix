"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import { TrailerModal } from "@/components/trailer-modal"

interface TrailerButtonProps {
  id: number
  title: string
  type: "movie" | "tv"
}

export function TrailerButton({ id, title, type }: TrailerButtonProps) {
  const [trailerOpen, setTrailerOpen] = useState(false)

  return (
    <>
      <Button className="gap-2" size="lg" onClick={() => setTrailerOpen(true)}>
        <PlayCircle className="h-5 w-5" />
        Watch Trailer
      </Button>

      <TrailerModal movieId={id} title={title} isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </>
  )
}

