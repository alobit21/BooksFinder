const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Initialize Prisma Client using the same approach as the main app
const globalForPrisma = globalThis || {}

const prisma = globalForPrisma.prisma || new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL || 'postgresql://default:CateX3QI2rJH@ep-snowy-bread-a49jrays-pooler.us-east-1.aws.neon.tech/BookFinder?sslmode=require&channel_binding=require',
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

async function createUsers() {
  console.log('🌱 Creating users in database...')
  
  const users = [
    {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    },
    {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: 'password123',
    },
    {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: 'password123',
    },
    {
      email: 'charlie@example.com',
      name: 'Charlie Brown',
      password: 'password123',
    },
  ]

  for (const userData of users) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
        },
      })
      
      console.log(`✅ Created user: ${user.email} (${user.name})`)
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message)
    }
  }
  
  console.log('🎉 User creation completed!')
  
  // Display all users
  const allUsers = await prisma.user.findMany()
  console.log('\n📋 All users in database:')
  allUsers.forEach(user => {
    console.log(`  - ${user.email} (${user.name})`)
  })
}

createUsers()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
