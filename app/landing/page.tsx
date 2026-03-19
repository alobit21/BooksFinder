import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Upload, Library, Users, Shield, Zap } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal
            <span className="text-blue-600"> Digital Library</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload, manage, and read your personal book collection in one beautiful, organized space. 
            Support for PDF and EPUB files with full control over your library.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Easy Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload PDF and EPUB files with drag-and-drop simplicity. 
                Add cover images and metadata for a complete library experience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Library className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Organize & Manage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep your books organized with tags, descriptions, and custom metadata. 
                Edit, delete, or update your collection anytime.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Read Anywhere</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Read your books directly in the browser with our built-in PDF viewer. 
                Download files for offline reading anytime.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Private & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your books are private by default. Only you can access your personal library.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Optional Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose to make books public and share your library with others via a simple link.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Fast & Responsive</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with modern technology for a smooth, fast experience on any device.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
