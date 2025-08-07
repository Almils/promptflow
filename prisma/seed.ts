import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create dummy users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        points: 120,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        points: 95,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        points: 75,
      },
    }),
  ]);

  // Create posts
  await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Prompt Engineering',
        content: 'This is a sample post for community learning.',
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Advanced GPT-4 Tricks',
        content: 'Learn advanced prompting techniques here.',
        authorId: users[1].id,
      },
    }),
  ]);

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
