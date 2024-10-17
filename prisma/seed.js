const prisma = require("../prisma");

const seed = async () => {
  // Create 1 user with 3 tasks
  const tasks = Array.from({ length: 3 }, (_, i) => ({
    name: `Task ${i + 1}`,
  }));
  await prisma.user.create({
    data: {
      username: "wobblethud",
      password: "fake_unhashed_password",
      tasks: { create: tasks },
    },
  });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
