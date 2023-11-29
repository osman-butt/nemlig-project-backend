import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getFavoritesFromDB() {
  return await prisma.product.findMany({
    where: {
      favorites: {
        some: {},
      },
    },
    include: {
          labels: true,
          categories: true,
          inventory: true,
          images: true,
          prices: true,
          favorites: true,
      },
    });
  };


async function getFavoriteByIdFromDB(productId) {
  return await prisma.product.findUnique({
    where: {
      product_id: productId,
      favorites: {
        some: {},
      },
    },
    include: {
      labels: true,
      categories: true,
      inventory: true,
      images: true,
      prices: true,
      favorites: true,
    },
  });
}

async function postFavoriteInDB(productId, customerId) {
  return await prisma.favorite.create({
    data: {
      product_id: productId,
      customer_id: customerId,
    },
  });
}

async function deleteFavoriteFromDB(productId, customerId) {
  return await prisma.favorite.delete({
    where: {
      product_id: productId,
      customer_id: customerId,
    },
  });
}

async function searchFavoritesFromDB(search){
  return await prisma.product.findMany({
    where: {
      product_name: {
        contains: search,
      },
      favorites: {
        some: {},
      }
      },
    include: {
      labels: true,
      categories: true,
      inventory: true,
      images: true,
      prices: true,
      favorites: true,
    },
  });
}

export { getFavoritesFromDB, getFavoriteByIdFromDB, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB };
