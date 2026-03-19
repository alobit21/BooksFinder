# BooksFinder - Personal Book Management System

A full-featured Next.js application for uploading, managing, and reading personal book collections with PDF and EPUB support.

## Features

- **User Authentication**: Secure email/password authentication with NextAuth
- **File Upload**: Upload PDF and EPUB files with UploadThing
- **Book Management**: Edit, delete, and organize your personal library
- **In-Browser Reading**: Built-in PDF viewer for direct reading
- **Public Sharing**: Optional public sharing of books via shareable links
- **Modern UI**: Clean, responsive design with Tailwind CSS and shadcn/ui
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Neon PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: UploadThing
- **UI**: Tailwind CSS + shadcn/ui components
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Neon PostgreSQL database (free tier available)
- An UploadThing account (free tier available)

### Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   cd books-finder
   npm install
   ```

2. **Environment Variables**
   
   Create a `.env` file with the following variables:
   ```env
   # Database
   DATABASE_URL="your_neon_database_url"
   
   # NextAuth
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # UploadThing
   UPLOADTHING_SECRET="your_uploadthing_secret"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000/landing` to see the landing page, or `http://localhost:3000` for the original Open Library search.

## Application Structure

### Authentication Routes
- `/auth/signin` - User login
- `/auth/signup` - User registration

### Main Application
- `/dashboard` - User's personal library
- `/dashboard/upload` - Upload new books
- `/dashboard/edit/[id]` - Edit book details
- `/my-book/[id]` - Read individual books

### Public Features
- `/library/[userId]` - Public library view (when books are shared)

### API Routes
- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/auth/register` - User registration
- `/api/books` - Book CRUD operations
- `/api/books/[id]` - Individual book operations
- `/api/uploadthing` - File upload handling

## Database Schema

### User Model
```typescript
{
  id: string
  email: string (unique)
  password: string (hashed)
  name?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Book Model
```typescript
{
  id: string
  title: string
  description?: string
  fileUrl: string
  coverUrl?: string
  author?: string
  isPublic: boolean
  fileType: string // "pdf" | "epub"
  fileSize: number
  userId: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

## File Upload Support

### Supported Formats
- PDF files (up to 32MB)
- EPUB files (up to 32MB)
- Cover images (JPG/PNG, up to 4MB)

### Storage
Files are stored via UploadThing and URLs are saved in the database.

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Route protection with middleware
- User-specific book access control
- File type validation

## Development Notes

### Running Prisma Commands
```bash
# Generate client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

### Environment Setup
Make sure to add your `.env` file to `.gitignore` to keep secrets secure.

## Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Digital Ocean App Platform

### Environment Variables for Production
Set all environment variables in your hosting platform's dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
