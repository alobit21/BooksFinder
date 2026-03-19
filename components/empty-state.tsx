import { Search } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No books found</h2>
      <p className="text-muted-foreground max-w-md">
        Try adjusting your search terms or browse with different keywords to find the books you're looking for.
      </p>
    </div>
  )
}

