import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

async function getFavoritesFromDB() {
  return await prisma.product.findMany({
    where: {
      favorites: {
        some: {},
      },
    },
    include: {
      images: true,
      labels: true,
      categories: true,
      inventory: true,
      prices: true,
      favorites: true,
    },
  });
}

async function getFavoriteByIdFromDB(productId) {
  return await prisma.product.findUnique({
    where: {
      product_id: productId,
      favorites: {
        some: {},
      },
    },
    include: {
      images: true,
      labels: true,
      categories: true,
      inventory: true,
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

async function searchFavoritesFromDB(search, category) {
  let favorites;
  if (category) {
    favorites = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            category_name: category,
          },
        },
        favorites: {
          some: {},
        },
      },
      include: {
        images: true,
        labels: true,
        categories: true,
        inventory: true,
        prices: true,
        favorites: true,
      },
    });
  } else {
    favorites = await prisma.product.findMany({
      where: {
        favorites: {
          some: {},
        },
      },
      include: {
        images: true,
        labels: true,
        categories: true,
        inventory: true,
        prices: true,
        favorites: true,
      },
    });
  }

  console.log(`Total results before search ${favorites.length}`);

  const options = {
    threshold: 0.4,
    keys: ["product_name"],
  };

  const fuse = new Fuse(favorites, options);

  const result = fuse.search(search);

  console.log(`Total results after search ${result.length}`);

  return result.map((item) => item.item);
  // return result; // IF WE WANT TO RETURN IN ITEM OBJECT WHERE SCORE AND MATCHES CAN BE INCLUDED
}

export { getFavoritesFromDB, getFavoriteByIdFromDB, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB };
