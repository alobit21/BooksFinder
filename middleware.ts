import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Redirect unauthenticated users trying to access protected routes
  if (
    !isAuthenticated &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/my-book") ||
      pathname.startsWith("/api/books"))
  ) {
    const url = new URL("/auth/signin", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    (pathname.startsWith("/auth/signin") ||
      pathname.startsWith("/auth/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
  runtime: "nodejs",
}
