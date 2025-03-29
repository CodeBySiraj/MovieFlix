"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Film, Search, Menu, ChevronDown, Home, Tv, TrendingUp, Users, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
]

const languages = [
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "zh", name: "Chinese" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/movies/popular", label: "Movies", icon: <Film className="h-4 w-4 mr-2" /> },
    { href: "/tv", label: "TV Shows", icon: <Tv className="h-4 w-4 mr-2" /> },
    { href: "/trending", label: "Trending", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { href: "/person/popular", label: "People", icon: <Users className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || pathname !== "/"
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">MovieFlix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 text-sm font-medium">
                  Genres
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 grid grid-cols-2 gap-1 p-2">
                {genres.map((genre) => (
                  <DropdownMenuItem key={genre.id} asChild className="col-span-1">
                    <Link href={`/genre/${genre.id}`}>{genre.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 text-sm font-medium">
                  Languages
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-2">
                {languages.map((language) => (
                  <DropdownMenuItem key={language.code} asChild>
                    <Link href={`/movies/language/${language.code}`}>{language.name}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/movies/languages" className="font-medium text-primary">
                    View All Languages
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="relative w-full max-w-sm items-center flex"
              >
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies, TV shows, people..."
                  className="w-full bg-background pl-8 pr-10 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.form>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <Film className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">MovieFlix</span>
                </Link>

                <form onSubmit={handleSearch} className="relative w-full items-center">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search movies, TV shows, people..."
                    className="w-full bg-background pl-8 focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center py-2 text-sm font-medium transition-colors hover:text-primary ${
                        pathname === link.href ? "text-primary" : "text-foreground/60"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}

                  <div className="pt-4">
                    <p className="py-2 text-sm font-medium">Genres</p>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/genre/${genre.id}`}
                          className="block py-1 text-sm transition-colors hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="py-2 text-sm font-medium">Languages</p>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {languages.map((language) => (
                        <Link
                          key={language.code}
                          href={`/movies/language/${language.code}`}
                          className="block py-1 text-sm transition-colors hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {language.name}
                        </Link>
                      ))}
                      <Link
                        href="/movies/languages"
                        className="block py-1 text-sm font-medium text-primary transition-colors hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        View All Languages
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

