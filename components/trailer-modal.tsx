"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TrailerModalProps {
  movieId: number
  title: string
  isOpen: boolean
  onClose: () => void
}

export function TrailerModal({ movieId, title, isOpen, onClose }: TrailerModalProps) {
  const [trailer, setTrailer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      const fetchTrailer = async () => {
        setLoading(true)
        setError(null)

        try {
          const res = await fetch(`/api/trailer?id=${movieId}&type=movie`)

          if (!res.ok) {
            throw new Error("Failed to fetch trailer")
          }

          const data = await res.json()

          if (data.key) {
            setTrailer(data.key)
          } else {
            setError("No trailer available")
          }
        } catch (err) {
          setError("Error loading trailer")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchTrailer()
    } else {
      setTrailer(null)
    }
  }, [isOpen, movieId])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-black border-0 rounded-lg shadow-2xl">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
          <DialogTitle className="text-white">{title} - Trailer</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                <p className="text-white/80">Loading trailer...</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                <p className="text-white/80">{error}</p>
              </motion.div>
            )}

            {trailer && !loading && (
              <motion.div
                key="trailer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

