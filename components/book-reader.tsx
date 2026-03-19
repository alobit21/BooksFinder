"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, BookOpen } from "lucide-react"

interface BookReaderProps {
  book: {
    id: string
    title: string
    author?: string | null
    description?: string | null
    fileUrl: string
    fileType: string
    fileSize: number
    createdAt: Date
  }
}

export function BookReader({ book }: BookReaderProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDownload = () => {
    window.open(book.fileUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {book.fileType.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  {formatFileSize(book.fileSize)}
                </span>
              </div>
              
              {book.description && (
                <p className="text-gray-700">{book.description}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Book Reader</h2>
            </div>
            <p className="text-sm text-gray-600">
              Read your book directly in the browser
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {book.fileType === "pdf" ? (
              <iframe
                src={book.fileUrl}
                className="w-full h-[700px]"
                title={`PDF viewer for ${book.title}`}
                onLoad={() => setIsLoading(false)}
              />
            ) : book.fileType === "epub" ? (
              <div className="flex items-center justify-center h-[700px] bg-gray-50">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    EPUB Reader
                  </h3>
                  <p className="text-gray-600 mb-4">
                    EPUB reader is coming soon! For now, you can download the file.
                  </p>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download EPUB
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[700px] bg-gray-50">
                <div className="text-center">
                  <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Unsupported Format
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This file format is not supported for in-browser reading.
                  </p>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
