import * as crypto from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        id: crypto.randomUUID(),
        username: 'normalUser',
        role: 'user',
        password: bcrypt.hashSync('Pass1234@', 8),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        username: 'adminUser',
        role: 'admin',
        password: bcrypt.hashSync('Pass1234@', 8),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
