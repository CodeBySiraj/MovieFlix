"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"

interface MediaGalleryProps {
  videos: any[] | undefined
  images:
    | {
        backdrops?: any[]
        posters?: any[]
      }
    | undefined
  title: string
}

export function MediaGallery({ videos, images, title }: MediaGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const trailers =
    videos?.filter((video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")) || []

  const backdrops = images?.backdrops?.slice(0, 12) || []
  const posters = images?.posters?.slice(0, 12) || []

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Media</h2>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
          <TabsTrigger value="posters">Posters</TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          {trailers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trailers.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedVideo(video.key)}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-1">{video.name}</h3>
                    <p className="text-sm text-muted-foreground">{video.type}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No videos available.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="backdrops">
          {backdrops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {backdrops.map((backdrop, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(`https://image.tmdb.org/t/p/original${backdrop.file_path}`)}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                      alt={`${title} backdrop ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No backdrops available.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="posters">
          {posters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {posters.map((poster, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(`https://image.tmdb.org/t/p/original${poster.file_path}`)}
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${poster.file_path}`}
                      alt={`${title} poster ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No posters available.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-black">
          <DialogHeader className="p-4 sm:p-6">
            <DialogTitle>{title} - Video</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[1200px] p-0 overflow-hidden bg-black">
          <div className="relative w-full max-h-[90vh] flex items-center justify-center">
            {selectedImage && (
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={title}
                width={1200}
                height={800}
                className="object-contain max-h-[90vh]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

