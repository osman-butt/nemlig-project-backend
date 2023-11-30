import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import { sortProducts } from "../utils/sortUtils.js";

const prisma = new PrismaClient();

async function getFavoritesFromDB(sort, label) {
  let where = {};
  if (label) {
    where.labels = {
      some: {
        label_name: label,
      },
    };
  }
  let products = await prisma.product.findMany({
    where: {
      ...where,
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

  if (sort) {
    products = sortProducts(products, sort);
  }
  return products;
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

async function searchFavoritesFromDB(search, sort, label) {
  let where = {};
  if (label) {
    where.labels = {
      some: {
        label_name: label,
      },
    };
  }
  const favorites = await prisma.product.findMany({
    where: {
      ...where,
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

  console.log(`Total results before search ${favorites.length}`);

  const options = {
    threshold: 0.4,
    keys: ["product_name"],
  };

  const fuse = new Fuse(favorites, options);
  let result = fuse.search(search);

  console.log(`Total results after search ${result.length}`);

  result = result.map((item) => item.item);
  // return result; // IF WE WANT TO RETURN IN ITEM OBJECT WHERE SCORE AND MATCHES CAN BE INCLUDED

  if (sort) {
    result = sortProducts(result, sort);
  }
  return result;
}

export { getFavoritesFromDB, getFavoriteByIdFromDB, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB };
