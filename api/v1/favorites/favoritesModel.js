import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getFavoritesFromDB() {
  return await prisma.product.findMany({
    include: {
      labels: true,
      categories: true,
      inventory: true,
      // images: true,
      prices: true,
      favorites: true,
    },
  });
}

export { getFavoritesFromDB };
