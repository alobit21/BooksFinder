// Import the exact same Prisma client as the working app
const { prisma } = require('../lib/db.js')
const bcrypt = require('bcryptjs')

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
}

createUsers()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
