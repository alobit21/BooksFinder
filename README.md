# 📚 BooksFinder

A full-stack book discovery and personal library app. Search millions of titles from Open Library, read online, and upload your own books to a personal library.

**Live demo:** https://books-finder-brown.vercel.app

## Features

- **Search & browse** books, authors and subjects via the [Open Library](https://openlibrary.org/developers/api) API
- **Reader:** in-app book viewer and Google Books embed
- **Accounts:** sign up / sign in with NextAuth (credentials, bcrypt-hashed passwords)
- **Personal library:** upload your own books (Cloudinary / UploadThing), edit them from a dashboard, and share a public library page per user
- **Dark / light theme**, responsive UI

## Tech Stack

| Area | Tools |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| UI | Tailwind CSS, shadcn/ui, Radix UI, Framer Motion |
| Auth | NextAuth + Prisma adapter |
| Database | PostgreSQL ([Neon](https://neon.tech)) via Prisma |
| Uploads | Cloudinary, UploadThing |

## Getting Started

```bash
git clone https://github.com/alobit21/BooksFinder.git
cd BooksFinder
npm install
```

Create `.env` in the project root:

```env
DATABASE_URL=postgresql://...
SHADOW_DATABASE_URL=postgresql://...   # only needed for prisma migrate dev
NEXTAUTH_SECRET=<random string>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

UploadThing also needs its own token if you use that upload route (see `app/api/uploadthing`).

```bash
npx prisma migrate deploy   # create tables
npm run db:seed             # optional sample data
npm run dev                 # http://localhost:3000
```

## Project Structure

```
app/            Routes: search, book/[id], author/[id], subject/[name], dashboard, library/[userId], api/*
components/     UI + readers (book-reader, google-books-viewer, ai-reader)
lib/            Auth, database, Cloudinary, Open Library helpers
prisma/         Schema, migrations, seed
```

## Author

**Aloyce Mtavangu**: [Portfolio](https://mac.tarxemo.com) · [LinkedIn](https://www.linkedin.com/in/aloyce-mtavangu-5932652a0)
