import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error?: string
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {error || "Something went wrong. Please try again."}
        </AlertDescription>
      </Alert>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}
