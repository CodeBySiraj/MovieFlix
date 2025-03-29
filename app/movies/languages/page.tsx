import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

// Language data with ISO codes, names, and region flags
const languages = [
  { code: "en", name: "English", flag: "us", region: "United States, United Kingdom" },
  { code: "ko", name: "Korean", flag: "kr", region: "South Korea" },
  { code: "ja", name: "Japanese", flag: "jp", region: "Japan" },
  { code: "fr", name: "French", flag: "fr", region: "France, Canada, Belgium" },
  { code: "es", name: "Spanish", flag: "es", region: "Spain, Mexico, Latin America" },
  { code: "de", name: "German", flag: "de", region: "Germany, Austria" },
  { code: "it", name: "Italian", flag: "it", region: "Italy" },
  { code: "zh", name: "Chinese", flag: "cn", region: "China, Taiwan, Hong Kong" },
  { code: "hi", name: "Hindi", flag: "in", region: "India" },
  { code: "ru", name: "Russian", flag: "ru", region: "Russia" },
  { code: "pt", name: "Portuguese", flag: "pt", region: "Portugal, Brazil" },
  { code: "sv", name: "Swedish", flag: "se", region: "Sweden" },
  { code: "da", name: "Danish", flag: "dk", region: "Denmark" },
  { code: "nl", name: "Dutch", flag: "nl", region: "Netherlands, Belgium" },
  { code: "no", name: "Norwegian", flag: "no", region: "Norway" },
  { code: "pl", name: "Polish", flag: "pl", region: "Poland" },
  { code: "tr", name: "Turkish", flag: "tr", region: "Turkey" },
  { code: "ar", name: "Arabic", flag: "sa", region: "Middle East, North Africa" },
  { code: "th", name: "Thai", flag: "th", region: "Thailand" },
  { code: "id", name: "Indonesian", flag: "id", region: "Indonesia" },
]

// Group languages by continent/region for better organization
const regions = [
  {
    name: "Asia & Pacific",
    languages: ["ko", "ja", "zh", "hi", "th", "id"],
  },
  {
    name: "Europe",
    languages: ["fr", "es", "de", "it", "ru", "pt", "sv", "da", "nl", "no", "pl", "tr"],
  },
  {
    name: "Americas",
    languages: ["en", "es", "pt"],
  },
  {
    name: "Middle East & Africa",
    languages: ["ar"],
  },
]

export default function LanguagesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">International Cinema</h1>
      <p className="text-muted-foreground mb-8">Discover movies from around the world in their original languages</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            Why Watch International Films?
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Experience diverse storytelling traditions and perspectives</li>
            <li>• Discover acclaimed directors and actors from around the world</li>
            <li>• Gain cultural insights and appreciation for different societies</li>
            <li>• Enjoy innovative filmmaking techniques that influence global cinema</li>
            <li>• Expand your cinematic horizons beyond Hollywood productions</li>
          </ul>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Popular International Film Movements</h2>
          <div className="grid grid-cols-2 gap-2">
            <Badge className="justify-start" variant="outline">
              French New Wave
            </Badge>
            <Badge className="justify-start" variant="outline">
              Italian Neorealism
            </Badge>
            <Badge className="justify-start" variant="outline">
              Japanese New Wave
            </Badge>
            <Badge className="justify-start" variant="outline">
              Korean New Wave
            </Badge>
            <Badge className="justify-start" variant="outline">
              German Expressionism
            </Badge>
            <Badge className="justify-start" variant="outline">
              Dogme 95
            </Badge>
            <Badge className="justify-start" variant="outline">
              Bollywood
            </Badge>
            <Badge className="justify-start" variant="outline">
              Hong Kong Action
            </Badge>
          </div>
        </div>
      </div>

      {/* Featured Languages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Languages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {languages.slice(0, 8).map((language) => (
            <Link key={language.code} href={`/movies/language/${language.code}`}>
              <Card className="overflow-hidden h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary">
                <div className="relative aspect-video bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center p-6">
                  <div className="absolute top-3 right-3">
                    <Image
                      src={`https://flagcdn.com/w80/${language.flag}.png`}
                      alt={`${language.name} flag`}
                      width={40}
                      height={30}
                      className="rounded shadow-sm"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-center">{language.name}</h3>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{language.region}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Languages by Region */}
      {regions.map((region) => (
        <div key={region.name} className="mb-10">
          <h2 className="text-xl font-bold mb-4">{region.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {region.languages.map((code) => {
              const language = languages.find((l) => l.code === code)
              if (!language) return null

              return (
                <Link key={language.code} href={`/movies/language/${language.code}`}>
                  <Card className="overflow-hidden h-full hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Image
                        src={`https://flagcdn.com/w40/${language.flag}.png`}
                        alt={`${language.name} flag`}
                        width={24}
                        height={18}
                        className="rounded"
                      />
                      <span className="font-medium">{language.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      {/* All Languages */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">All Languages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {languages.map((language) => (
            <Link
              key={language.code}
              href={`/movies/language/${language.code}`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Image
                src={`https://flagcdn.com/w20/${language.flag}.png`}
                alt={`${language.name} flag`}
                width={20}
                height={15}
                className="rounded"
              />
              <span>{language.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

