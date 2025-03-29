"use client"

import { useState } from "react"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CategoryFilterProps {
  categories: {
    id: number
    name: string
  }[]
  type: "movie" | "tv"
}

export function CategoryFilter({ categories, type }: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Button
              variant={hoveredCategory === category.id ? "default" : "ghost"}
              size="sm"
              className="rounded-full transition-all duration-300 hover:bg-primary hover:text-white"
              asChild
            >
              <Link href={`/${type === "movie" ? "genre" : "tv/genre"}/${category.id}`}>{category.name}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

