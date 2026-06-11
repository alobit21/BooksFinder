import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Upload, Library, Users, Shield, Zap, Search } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="max-w-[1280px] mx-auto px-16 py-24">
        <section className="text-center mb-24">
          <h1 className="text-[28px] font-semibold leading-snug text-[#222222] mb-6 tracking-[-0.44px] max-w-2xl mx-auto">
            Your Personal Digital Library
          </h1>
          <p className="text-base font-normal leading-relaxed text-[#6a6a6a] mb-10 max-w-2xl mx-auto">
            Upload, manage, and read your personal book collection in one beautiful, organized space. 
            Support for PDF and EPUB files with full control over your library.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-full h-16 border border-[#dddddd] shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
              <div className="flex-1 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-[#6a6a6a]" />
                  <span className="text-base font-normal text-[#6a6a6a]">Search for books, authors...</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#f2f2f2] flex items-center justify-center">
                  <Search className="h-4 w-4 text-[#222222]" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="default" className="bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-lg px-6 h-12 text-base font-medium tracking-normal">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="default" className="rounded-lg px-6 h-12 text-base font-medium border-[#c1c1c1] text-[#222222] hover:bg-[#f2f2f2]">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-[14px] border border-[#ebebeb] shadow-none hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow">
              <CardHeader className="items-center text-center pb-4">
                <div className="h-12 w-12 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-[#ff385c]" />
                </div>
                <CardTitle className="text-lg font-semibold text-[#222222] tracking-[-0.18px]">Easy Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed text-[#3f3f3f]">
                  Upload PDF and EPUB files with drag-and-drop simplicity. 
                  Add cover images and metadata for a complete library experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-[14px] border border-[#ebebeb] shadow-none hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow">
              <CardHeader className="items-center text-center pb-4">
                <div className="h-12 w-12 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-4">
                  <Library className="h-6 w-6 text-[#ff385c]" />
                </div>
                <CardTitle className="text-lg font-semibold text-[#222222] tracking-[-0.18px]">Organize & Manage</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed text-[#3f3f3f]">
                  Keep your books organized with tags, descriptions, and custom metadata. 
                  Edit, delete, or update your collection anytime.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-[14px] border border-[#ebebeb] shadow-none hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow">
              <CardHeader className="items-center text-center pb-4">
                <div className="h-12 w-12 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-[#ff385c]" />
                </div>
                <CardTitle className="text-lg font-semibold text-[#222222] tracking-[-0.18px]">Read Anywhere</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed text-[#3f3f3f]">
                  Read your books directly in the browser with our built-in PDF viewer. 
                  Download files for offline reading anytime.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-[14px] border border-[#ebebeb] shadow-none hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow">
              <CardHeader className="items-center text-center pb-4">
                <div className="h-10 w-10 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-[#222222]" />
                </div>
                <CardTitle className="text-base font-semibold text-[#222222] tracking-[-0.18px]">Private & Secure</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed text-[#3f3f3f]">
                  Your books are private by default. Only you can access your personal library.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-[14px] border border-[#ebebeb] shadow-none hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow">
              <CardHeader className="items-center text-center pb-4">
                <div className="h-10 w-10 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-[#222222]" />
                </div>
                <CardTitle className="text-base font-semibold text-[#222222] tracking-[-0.18px]">Optional Sharing</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed text-[#3f3f3f]">
                  Choose to make books public and share your library with others via a simple link.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-[14px] border border-[#ebebeb] shadow-none hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-shadow">
              <CardHeader className="items-center text-center pb-4">
                <div className="h-10 w-10 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5 text-[#222222]" />
                </div>
                <CardTitle className="text-base font-semibold text-[#222222] tracking-[-0.18px]">Fast & Responsive</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed text-[#3f3f3f]">
                  Built with modern technology for a smooth, fast experience on any device.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
