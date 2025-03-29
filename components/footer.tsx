import Link from "next/link"
import { Film } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-semibold">MovieFlix</span>
          </div>

          <p className="text-center text-sm text-muted-foreground md:text-left">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

