import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import { sortProducts } from "../sortUtils/sortUtils.js";

const prisma = new PrismaClient();

// Get customer ID from user ID (assuming the user ID is passed in the request body)
async function getCustomerIdfromUserId(userId){
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    include: { customer: true },
  });
  return user.customer.customer_id;
}

async function getFavoritesFromDB(customerId, category, sort, label) {
  let where = { customer_id: customerId};
  if (category){
    where.products = {
      ...where.products,
      categories: {
      some: {
        category_name: category,
      },
    },
    };
  }
  if (label) {
    where.products = {
      ...where.products,
      labels: {
      some: {
        label_name: label,
        },
      },
    };  
  }

  const favorites = await prisma.favorite.findMany({
    where,
    include: {
      products: {
        include: {
          images: true,
          labels: true,
          categories: true,
          inventory: true,
          prices: true,
        },
      }
       
      }
    });

    // NEED TO FLATTEN THE ARRAY FOR THE SORTING FUNCTION TO WORK PROPERLY
    let flatFavorites = favorites.map((favorite => ({
      favorite_id: favorite.favorite_id,
      customer_id: favorite.customer_id,
      ...favorite.products,
    })));


  if (sort) {
    flatFavorites = sortProducts(flatFavorites, sort);
  }
  return flatFavorites;
}

async function postFavoriteInDB(productId, customerId) {
  return await prisma.favorite.create({
    data: {
      product_id: productId,
      customer_id: customerId,
    },
  });
}

async function deleteFavoriteFromDB(favoriteId) {
  return await prisma.favorite.deleteMany({
    where: {
      favorite_id: favoriteId,
    },
  });
}

async function searchFavoritesFromDB(customerId, search, category, sort, label) {
  let where = { customer_id: customerId};
  if (category) {
    where.products = {
      ...where.products, //use spread operator to keep the other properties of the where object
        categories: {
          some: {
            category_name: category,
          },
      },
    };
  }
  if (label) {
    where.products = {
      ...where.products, //use spread operator to keep the other properties of the where object
        labels: {
          some: {
            label_name: label,
          },
        },
    };
  }
    
  const favorites = await prisma.favorite.findMany({
    where,
    include: {
      products: {
        include: {
          images: true,
          labels: true,
          categories: true,
          inventory: true,
          prices: true,
        },
      }
    },
  });

  
  console.log(`Total results before search ${favorites.length}`);
  
  // NEED TO FLATTEN THE ARRAY FOR FUSE TO WORK PROPERLY AND BE ABLE TO SEARCH THE NESTED CATEGORY/LABEL FILTER
  const flatFavorites = favorites.map((favorite => ({
    favorite_id: favorite.favorite_id,
    customer_id: favorite.customer_id,
    ...favorite.products,
  })))

  const options = {
    threshold: 0.4,
    keys: ["product_name"],
  };

  const fuse = new Fuse(flatFavorites, options);
  let result = fuse.search(search);

  console.log(`Total results after search ${result.length}`);

  result = result.map((item) => item.item);
  // return result; // IF WE WANT TO RETURN IN ITEM OBJECT WHERE SCORE AND MATCHES CAN BE INCLUDED

  if (sort) {
    result = sortProducts(result, sort);
  }
  return result;
}

export { getFavoritesFromDB, getCustomerIdfromUserId, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB };
