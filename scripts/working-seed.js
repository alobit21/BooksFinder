const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Load environment variables
require('dotenv').config()

async function createUsers() {
  console.log('🌱 Creating users in database...')
  
  // Create PrismaClient with explicit environment variables
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
  
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

  let successCount = 0
  
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
      successCount++
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message)
    }
  }
  
  console.log(`🎉 User creation completed! ${successCount}/${users.length} users created successfully.`)
  
  // Display all users
  try {
    const allUsers = await prisma.user.findMany()
    console.log('\n📋 All users in database:')
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.name})`)
    })
    console.log(`\n📊 Total users: ${allUsers.length}`)
  } catch (error) {
    console.error('❌ Error fetching users:', error.message)
  }
  
  await prisma.$disconnect()
}

createUsers().catch(console.error)
