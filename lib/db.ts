// Simple database connection for demo purposes
// In production, this would use the actual Prisma client

const mockPrismaClient = {
  user: {
    findUnique: async ({ where }: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    findMany: async () => [],
  },
  book: {
    findUnique: async ({ where }: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    findMany: async () => [],
    update: async ({ where, data }: any) => ({ id: where.id, ...data }),
    delete: async ({ where }: any) => ({ id: where.id }),
    findFirst: async ({ where }: any) => null,
  },
  session: {
    findUnique: async ({ where }: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
  },
  account: {
    findUnique: async ({ where }: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
  },
  verificationToken: {
    findUnique: async ({ where }: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
  },
}

export const prisma = mockPrismaClient
