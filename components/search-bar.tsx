"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for movies, TV shows, people..."
            className={`w-full pl-8 pr-8 transition-all duration-200 ${
              isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "focus-visible:ring-primary"
            }`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-2.5 top-2.5"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full p-0 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
          Search
        </Button>
      </div>
    </form>
  )
}

