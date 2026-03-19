"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "@/lib/uploadthing"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"

export default function UploadBook() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [fileType, setFileType] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [isPublic, setIsPublic] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError("")
    setSuccess("")

    if (!fileUrl) {
      setError("Please upload a book file")
      setIsUploading(false)
      return
    }

    try {
      const session = await auth()
      if (!session?.user?.id) {
        setError("You must be logged in to upload books")
        return
      }

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
          fileType,
          fileSize,
          isPublic,
          userId: session.user.id,
        }),
      })

      if (response.ok) {
        setSuccess("Book uploaded successfully!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Book
            </CardTitle>
            <CardDescription>
              Add a new book to your personal library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Book File *</Label>
                  <UploadButton<OurFileRouter, "bookUploader">
                    endpoint="bookUploader"
                    onUploadBegin={() => {
                      setIsUploading(true)
                      setError("")
                    }}
                    onUploadError={(error) => {
                      setError(error.message)
                      setIsUploading(false)
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setFileUrl(res[0].url)
                        setFileType(res[0].name.endsWith('.pdf') ? 'pdf' : 'epub')
                        setFileSize(res[0].size)
                        setIsUploading(false)
                      }
                    }}
                  />
                  {fileUrl && (
                    <div className="text-sm text-green-600">
                      ✓ File uploaded successfully
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cover Image (Optional)</Label>
                  <UploadButton<OurFileRouter, "coverUploader">
                    endpoint="coverUploader"
                    onUploadBegin={() => setError("")}
                    onUploadError={(error) => setError(error.message)}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setCoverUrl(res[0].url)
                      }
                    }}
                  />
                  {coverUrl && (
                    <div className="text-sm text-green-600">
                      ✓ Cover uploaded successfully
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">Make this book public</Label>
                </div>
              </div>

              <Button type="submit" disabled={isUploading || !fileUrl} className="w-full">
                {isUploading ? "Uploading..." : "Upload Book"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
