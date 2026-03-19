import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadMoreProps {
  onLoadMore: () => void
  loading: boolean
  hasMore: boolean
}

export function LoadMore({ onLoadMore, loading, hasMore }: LoadMoreProps) {
  if (!hasMore) return null

  return (
    <div className="flex justify-center py-8">
      <Button 
        onClick={onLoadMore} 
        disabled={loading}
        variant="outline"
        size="lg"
        className="min-w-32"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </Button>
    </div>
  )
}
