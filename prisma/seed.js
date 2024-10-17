const prisma = require("./index");
const { faker } = require("@faker-js/faker");
const seed = async (numUser = 1, numTasks = 3) => {
  const tasks = Array.from({ length: numTasks }, () => ({
    name: faker.internet.displayName(),
  }));

  await prisma.user.create({
    data: {
      username: "fakeuser",
      password: "password",
      tasks: { create: tasks },
    },
  });
  //await prisma.task.createMany({ data: tasks, owner: { connect: user } });
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
