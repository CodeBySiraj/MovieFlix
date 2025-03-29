import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { SkeletonCard } from "@/components/skeleton-card"
import { ArrowLeft, Globe, Star, TrendingUp, Calendar } from "lucide-react"

async function getMoviesByLanguage(language: string, page = "1", sortBy = "popularity.desc") {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_original_language=${language}&page=${page}&sort_by=${sortBy}`,
    { next: { revalidate: 3600 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movies by language")
  }

  return res.json()
}

async function getMovieGenres() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movie genres")
  }

  return res.json()
}

// Get top directors for a language
async function getTopDirectors(language: string) {
  // This would typically come from a database or API
  // For this example, we'll use a static mapping
  const directorsByLanguage: Record<string, any[]> = {
    ko: [
      { id: 1452, name: "Bong Joon-ho", known_for: "Parasite, Memories of Murder" },
      { id: 21684, name: "Park Chan-wook", known_for: "Oldboy, The Handmaiden" },
      { id: 56760, name: "Kim Jee-woon", known_for: "I Saw the Devil, A Tale of Two Sisters" },
      { id: 3903, name: "Lee Chang-dong", known_for: "Burning, Poetry" },
    ],
    ja: [
      { id: 5681, name: "Akira Kurosawa", known_for: "Seven Samurai, Rashomon" },
      { id: 1632, name: "Hayao Miyazaki", known_for: "Spirited Away, My Neighbor Totoro" },
      { id: 3701, name: "Hirokazu Kore-eda", known_for: "Shoplifters, Nobody Knows" },
      { id: 3072, name: "Takeshi Kitano", known_for: "Hana-bi, Sonatine" },
    ],
    fr: [
      { id: 1032, name: "François Truffaut", known_for: "The 400 Blows, Jules and Jim" },
      { id: 4762, name: "Jean-Luc Godard", known_for: "Breathless, Contempt" },
      { id: 5870, name: "Claire Denis", known_for: "Beau Travail, High Life" },
      { id: 5602, name: "Jacques Audiard", known_for: "A Prophet, Rust and Bone" },
    ],
    es: [
      { id: 25, name: "Pedro Almodóvar", known_for: "Talk to Her, All About My Mother" },
      { id: 85, name: "Guillermo del Toro", known_for: "Pan's Labyrinth, The Shape of Water" },
      { id: 5726, name: "Alejandro Amenábar", known_for: "The Others, Open Your Eyes" },
      { id: 1125, name: "Luis Buñuel", known_for: "The Exterminating Angel, Belle de Jour" },
    ],
    zh: [
      { id: 490, name: "Wong Kar-wai", known_for: "In the Mood for Love, Chungking Express" },
      { id: 27221, name: "Ang Lee", known_for: "Crouching Tiger, Hidden Dragon, Life of Pi" },
      { id: 1047, name: "Zhang Yimou", known_for: "Hero, House of Flying Daggers" },
      { id: 7189, name: "Jia Zhangke", known_for: "A Touch of Sin, Mountains May Depart" },
    ],
  }

  return directorsByLanguage[language] || []
}

// Language information
const languageInfo: Record<string, any> = {
  en: {
    name: "English",
    flag: "us",
    region: "United States, United Kingdom, Canada, Australia",
    description:
      "English-language cinema encompasses Hollywood productions, British films, and works from other English-speaking countries. It has dominated global cinema since the early 20th century, producing countless influential films across all genres.",
    filmMovements: ["Hollywood Golden Age", "New Hollywood", "British New Wave", "Mumblecore"],
    majorStudios: ["Warner Bros.", "Universal", "Disney", "Paramount", "Sony Pictures"],
  },
  ko: {
    name: "Korean",
    flag: "kr",
    region: "South Korea",
    description:
      "South Korean cinema has gained international recognition for its unique blend of genres, bold storytelling, and technical excellence. The Korean New Wave began in the late 1990s, and Korean films have since become globally influential, culminating in Parasite's historic Best Picture Oscar win in 2020.",
    filmMovements: ["Korean New Wave", "K-Horror"],
    majorStudios: ["CJ Entertainment", "Lotte Entertainment", "Showbox"],
  },
  ja: {
    name: "Japanese",
    flag: "jp",
    region: "Japan",
    description:
      "Japanese cinema has a rich history dating back to the silent era. It gained international acclaim through directors like Akira Kurosawa and Yasujirō Ozu. Japanese films span diverse genres from samurai epics to anime, horror, and contemplative dramas, influencing filmmakers worldwide.",
    filmMovements: ["Japanese New Wave", "J-Horror", "Anime"],
    majorStudios: ["Toho", "Shochiku", "Studio Ghibli", "Toei Company"],
  },
  fr: {
    name: "French",
    flag: "fr",
    region: "France",
    description:
      "French cinema is known for its artistic innovation and intellectual depth. The French New Wave revolutionized filmmaking in the 1950s and 60s, emphasizing auteur theory and experimental techniques. France continues to produce acclaimed films that balance commercial appeal with artistic merit.",
    filmMovements: ["French New Wave", "Cinéma du look", "French Extremity"],
    majorStudios: ["Gaumont", "Pathé", "StudioCanal", "MK2"],
  },
  es: {
    name: "Spanish",
    flag: "es",
    region: "Spain, Mexico, Latin America",
    description:
      "Spanish-language cinema encompasses films from Spain and Latin America, each region with its distinct style. Spanish cinema flourished after Franco's dictatorship ended, while Mexican, Argentine, and Chilean films have gained international recognition for their social commentary and innovative storytelling.",
    filmMovements: ["Spanish Surrealism", "Movida Madrileña", "New Mexican Cinema"],
    majorStudios: ["Atresmedia Cine", "Telecinco Cinema", "El Deseo"],
  },
}

async function MoviesContent({ language, page, sortBy }: { language: string; page: string; sortBy: string }) {
  const [moviesData, genresData] = await Promise.all([getMoviesByLanguage(language, page, sortBy), getMovieGenres()])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {moviesData.results.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} genres={genresData.genres} />
        ))}
      </div>

      <Pagination
        currentPage={Number.parseInt(page)}
        totalPages={moviesData.total_pages > 500 ? 500 : moviesData.total_pages}
        baseUrl={`/movies/language/${language}?sort=${sortBy}&page=`}
      />
    </div>
  )
}

async function DirectorsSection({ language }: { language: string }) {
  const directors = await getTopDirectors(language)

  if (directors.length === 0) {
    return null
  }

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">Notable Directors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {directors.map((director) => (
          <Link key={director.id} href={`/person/${director.id}`}>
            <Card className="h-full hover:border-primary transition-colors">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{director.name}</h3>
                <p className="text-sm text-muted-foreground">{director.known_for}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function LanguageMoviesPage({
  params,
  searchParams,
}: {
  params: { language: string }
  searchParams: { page?: string; sort?: string }
}) {
  const { language } = params
  const page = searchParams.page || "1"
  const sortBy = searchParams.sort || "popularity.desc"

  // Get language info
  const info = languageInfo[language] || {
    name: language.toUpperCase(),
    flag: "un",
    region: "International",
    description: "Discover films in this language from around the world.",
    filmMovements: [],
    majorStudios: [],
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/movies/languages">
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Languages
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="md:w-2/3">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={`https://flagcdn.com/w80/${info.flag}.png`}
              alt={`${info.name} flag`}
              width={60}
              height={40}
              className="rounded shadow-sm"
            />
            <h1 className="text-3xl font-bold">{info.name} Cinema</h1>
          </div>

          <p className="text-muted-foreground mb-6">{info.description}</p>

          {info.filmMovements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Notable Film Movements</h2>
              <div className="flex flex-wrap gap-2">
                {info.filmMovements.map((movement: string) => (
                  <Badge key={movement} variant="secondary">
                    {movement}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {info.majorStudios.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Major Studios</h2>
              <div className="flex flex-wrap gap-2">
                {info.majorStudios.map((studio: string) => (
                  <Badge key={studio} variant="outline">
                    {studio}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/3 bg-card rounded-lg border p-4">
          <h2 className="font-semibold mb-3 flex items-center">
            <Globe className="h-4 w-4 mr-2 text-primary" />
            Quick Facts
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="font-medium mr-2">Region:</span>
              <span className="text-muted-foreground">{info.region}</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">ISO Code:</span>
              <span className="text-muted-foreground">{language}</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">Writing System:</span>
              <span className="text-muted-foreground">
                {language === "ko"
                  ? "Hangul"
                  : language === "ja"
                    ? "Kanji, Hiragana, Katakana"
                    : language === "zh"
                      ? "Simplified/Traditional Chinese"
                      : language === "hi"
                        ? "Devanagari"
                        : language === "ar"
                          ? "Arabic"
                          : language === "th"
                            ? "Thai script"
                            : "Latin alphabet"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Suspense fallback={<DirectorsSkeleton />}>
        <DirectorsSection language={language} />
      </Suspense>

      <Tabs defaultValue={sortBy} className="w-full mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Movies</h2>
          <TabsList>
            <TabsTrigger value="popularity.desc" asChild>
              <Link href={`/movies/language/${language}?sort=popularity.desc&page=1`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                Popular
              </Link>
            </TabsTrigger>
            <TabsTrigger value="vote_average.desc" asChild>
              <Link href={`/movies/language/${language}?sort=vote_average.desc&page=1`}>
                <Star className="h-4 w-4 mr-1" />
                Top Rated
              </Link>
            </TabsTrigger>
            <TabsTrigger value="primary_release_date.desc" asChild>
              <Link href={`/movies/language/${language}?sort=primary_release_date.desc&page=1`}>
                <Calendar className="h-4 w-4 mr-1" />
                Recent
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={sortBy} className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <MoviesContent language={language} page={page} sortBy={sortBy} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      {Array.from({ length: 20 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

function DirectorsSkeleton() {
  return (
    <div className="mb-10">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardContent className="p-4 space-y-2">
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

