import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// VI KAN GETTE PÅ BEGGE MÅDER SOM NEDENFOR - ENTEN JOINER VI PRODUCTS IND PÅ FAVORITES, ELLER OGSÅ SÅ JOINER VI FAVORITES IND PÅ PRODUCTS
async function getFavoritesFromDB() {
  return await prisma.favorite.findMany({
    include: {
      products: {
        include: {
      labels: true,
      categories: true,
      inventory: true,
      // images: true,
      prices: true,
    },
  },
  },
  });
}

async function getFavoriteByIdFromDB(productId) {
  return await prisma.product.findUnique({
    where: { 
      product_id: productId,
      favorites: {
        some: {} },
      },
    include: {
      labels: true,
      categories: true,
      inventory: true,
      //images: true,
      prices: true,
      favorites: true,
    },
  });
}

async function postFavoriteInDB(productId, customerId){
  return await prisma.favorite.create({
    data:{
      product_id: productId,
      customer_id: customerId
    }
  })
}

export { getFavoritesFromDB, getFavoriteByIdFromDB, postFavoriteInDB };
