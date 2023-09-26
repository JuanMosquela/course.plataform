const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

const main = async () => {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Accounting" },
        { name: "Photography" },
        { name: "Engineering" },
        { name: "Filming" },
      ],
    });

    console.log("sucess");
  } catch (error) {
    console.log(error);
  } finally {
    database.$disconnect();
  }
};

main();
