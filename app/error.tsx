"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <AlertTriangle className="h-32 w-32 text-destructive opacity-80" />
      </div>

      <h1 className="text-4xl font-bold mb-4">Something Went Wrong</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We're sorry, but we encountered an error while processing your request.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Button variant="default" size="lg" className="flex items-center gap-2" onClick={reset}>
          <RotateCcw className="h-5 w-5" />
          Try Again
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="mt-8 p-4 bg-card rounded-lg max-w-md">
        <p className="text-sm text-muted-foreground">
          If this problem persists, please try refreshing the page or coming back later.
        </p>
      </div>
    </main>
  )
}

