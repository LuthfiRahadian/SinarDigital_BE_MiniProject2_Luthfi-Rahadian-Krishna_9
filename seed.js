const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create 5 users
  const usersData = [];
  for (let i = 1; i <= 5; i++) {
    usersData.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    });
  }
  const users = await Promise.all(
    usersData.map((u) => prisma.user.create({ data: u }))
  );

  // Create 20+ posts distributed among users
  const posts = [];
  for (let i = 1; i <= 20; i++) {
    posts.push({
      title: `Sample Post ${i}`,
      content: `This is the content for sample post number ${i}.`,
      imagePath: null,
      userId: users[(i - 1) % users.length].id,
    });
  }

  for (const p of posts) {
    await prisma.post.create({ data: p });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
