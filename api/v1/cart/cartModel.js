import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCartFromDb() {
  return await prisma.product.findMany({
    where: {
      cart: {
        some: {},
      },
    },
    include: {
      prices: true,
      cart: true,
    },
  });
}

export { getCartFromDb };
