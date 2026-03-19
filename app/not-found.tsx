"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Book, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Book className="h-16 w-16 text-muted-foreground" />
                  <div className="absolute -top-2 -right-2">
                    <div className="h-6 w-6 bg-destructive rounded-full flex items-center justify-center">
                      <span className="text-destructive-foreground text-xs font-bold">!</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Page Not Found</h1>
                <p className="text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
              
              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search for Books
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
