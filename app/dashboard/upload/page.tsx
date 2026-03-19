"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleUpload } from "@/components/simple-upload"
import { BookOpen, Image } from "lucide-react"

export default function UploadBook() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [isPublic, setIsPublic] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileUpload = (url: string, type: string, size: number) => {
    if (type === "book") {
      setFileUrl(url)
      setFileSize(size)
    } else {
      setCoverUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError("")
    setSuccess("")

    if (!title || !fileUrl) {
      setError("Title and book file are required")
      setIsUploading(false)
      return
    }

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          description,
          fileUrl,
          coverUrl,
          isPublic,
          fileType: "pdf", // Default to PDF for demo
          fileSize,
        }),
      })

      if (response.ok) {
        setSuccess("Book uploaded successfully!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to upload book")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Book</CardTitle>
            <CardDescription>
              Add a new book to your personal library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a brief description"
                    rows={4}
                  />
                </div>

                <SimpleUpload
                  onUpload={handleFileUpload}
                  accept=".pdf,.epub"
                  label="Book File *"
                  maxSize="32MB"
                  icon={<BookOpen className="h-8 w-8 text-gray-400" />}
                />

                <SimpleUpload
                  onUpload={handleFileUpload}
                  accept="image/*"
                  label="Cover Image (Optional)"
                  maxSize="4MB"
                  icon={<Image className="h-8 w-8 text-gray-400" />}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                    Make this book public
                  </Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Book"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
