import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function MoviesByYearPage() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
  const decades = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950, 1940, 1930, 1920]

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movies by Year</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Recent Years</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {years.slice(0, 12).map((year) => (
            <Link key={year} href={`/movies/year/${year}`}>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="flex items-center justify-center p-4 h-24">
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <span className="font-bold text-lg">{year}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">By Decade</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {decades.map((decade) => (
            <Link key={decade} href={`/movies/decade/${decade}`}>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="flex items-center justify-center p-4 h-24">
                  <div className="text-center">
                    <span className="font-bold text-lg">{decade}s</span>
                    <p className="text-xs text-muted-foreground">
                      {decade}-{decade + 9}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Years</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {years.map((year) => (
            <Link
              key={year}
              href={`/movies/year/${year}`}
              className="block p-2 text-center hover:bg-primary/10 rounded-md transition-colors"
            >
              <span className="font-medium">{year}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

