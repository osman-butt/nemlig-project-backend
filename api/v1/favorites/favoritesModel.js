import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import { sortProducts } from "../sortUtils/sortUtils.js";

const prisma = new PrismaClient();

// Get customer ID from user ID (assuming the user ID is passed in the request body)
async function getCustomerIdfromUserId(userEmail){
try {
  console.log(`getCustomerIdfromUserId called with UserEmail: ${userEmail}`)
  // Fetch the user from the DB and include the related customer ID.
  const user = await prisma.user.findFirst({
    where: { user_email: userEmail },
    include: { customer: true },
  });
  console.log(`User found: ${JSON.stringify(user)}`);

  // Return the customer ID of the user.
  return user.customer.customer_id;
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to get customer ID" }); 
}
}


async function getFavoritesFromDB(userEmail, category, sort, label) {
  const customerId = await getCustomerIdfromUserId(userEmail); // UserID should also be passed in the request body instead of customerId, since we convert it here
  // Define the where clause for the Prisma query
  let where = { customer_id: customerId};
  // If a category is passed in the request query, add it to the where clause
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
  // If a label is passed in the request query, add it to the where clause
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
  // Fetch the favorites from the DB and include the related product data.
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

    // Flatten the favorites array for the sorting function to work
    let flatFavorites = favorites.map((favorite => ({
      favorite_id: favorite.favorite_id,
      customer_id: favorite.customer_id,
      ...favorite.products,
    })));

  // If a sort parameter is passed in the request query, sort the favorites
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
  // Define the where clause for the Prisma query
  let where = { customer_id: customerId};
  // If a category is passed in the request query, add it to the where clause
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
  // If a label is passed in the request query, add it to the where clause
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
  // Fetch the favorites from the DB and include the related product data.  
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
  
  // Flatten the favorites array for the Fuse search to work properly (Fuse can't search nested objects)
  const flatFavorites = favorites.map((favorite => ({
    favorite_id: favorite.favorite_id,
    customer_id: favorite.customer_id,
    ...favorite.products,
  })))
  // Fuse search options
  const options = {
    threshold: 0.4,
    keys: ["product_name"],
  };

  const fuse = new Fuse(flatFavorites, options);
  let result = fuse.search(search);

  console.log(`Total results after search ${result.length}`);
  // Map the result to only return the product object
  result = result.map((item) => item.item);
  // return result; // IF WE WANT TO RETURN IN ITEM OBJECT WHERE SCORE AND MATCHES CAN BE INCLUDED
  
  // If a sort parameter is passed in the request query, sort the favorites
  if (sort) {
    result = sortProducts(result, sort);
  }
  return result;
}

export { getFavoritesFromDB, getCustomerIdfromUserId, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB };
