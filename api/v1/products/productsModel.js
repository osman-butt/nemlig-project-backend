import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import { sortProducts } from "../sortUtils/sortUtils.js";

const prisma = new PrismaClient();

// Get customer ID from user ID (assuming the user ID is passed in the request body)
async function getCustomerIdFromUserEmail(userEmail){
  try {
    // Fetch the user from the DB and include the related customer ID.
    const user = await prisma.user.findFirst({
      where: { user_email: userEmail },
      include: { customer: true },
    });
    console.log(`Customer id: ${JSON.stringify(user.customer.customer_id)}`);
    // Return the customer ID of the user.
    return user.customer.customer_id;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get customer ID" }); 
  }
  }

async function getProductsFromDB(category, sort, label, userEmail) {
  // Define the where and orderBy clause for the Prisma query
  let orderBy = {};
  let where = {};
  let customerId;

  // Get the customer_id from the user_email only if userEmail is defined
  if (userEmail){
  customerId = await getCustomerIdFromUserEmail(userEmail); 
}

  // If a category is passed in the request query, add it to the where clause
  if (category) {
    where.categories = {
      some: {
        category_name: category,
      },
    };
  }
  // If a label is passed in the request query, add it to the where clause
  if (label) {
    where.labels = {
      some: {
        label_name: label,
      },
    };
  }
  // Fetch products from the DB
  let products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: true,
      labels: true,
      categories: true,
      inventory: true,
      prices: true,
    },
  });

if (customerId) {
  // Fetch all favorites for the current user
  const userFavorites = await prisma.favorite.findMany({
    where: {
      customer_id: customerId,
    },
  });

  for (let product of products) {
    // Check if a favorite exists in the fetched favorites
    const userFavorite = userFavorites.find(favorite => favorite.product_id === product.product_id);
    // If a favorite is found, add its favorite_id to the product, if not return undefined
    product.favorite_id = userFavorite ? userFavorite.favorite_id : undefined;
  }
}

  // Sort the products if a sort query is passed
  if (sort) {
    products = sortProducts(products, sort);
  }
  

  return products;
}

async function getProductByIdFromDB(productId) {
  return await prisma.product.findUnique({
    where: { product_id: productId },
    include: {
      images: true,
      labels: true,
      categories: true,
      inventory: true,
      prices: true,
    },
  });
}

async function postProductsInDB(productData) {
  return await prisma.product.create({
    data: {
      product_name: productData.product_name,
      product_underline: productData.product_underline,
      product_description: productData.product_description,
      // Create related images
      images: {
        createMany: {
          data: productData.images.map(image => ({
            image_url: image.image_url,
          })),
        },
      },
      labels: {
        // Connect existing labels to the product
        connect: productData.labels.map((label) => ({ label_id: label })),
      },
      categories: {
        // Connect existing categories to the product
        connect: productData.categories.map((category) => ({ category_id: category })),
      },
      // Create related inventory
      inventory: {
        create: {
          inventory_stock: productData.inventory_stock,
        },
      },
      // Create related prices
      prices: {
        createMany: {
          data: productData.prices.map((price) => ({
            price: price.price,
            starting_at: new Date(price.starting_at).toISOString(),
            is_campaign: price.is_campaign,
            ending_at: new Date(price.ending_at).toISOString(),
          })),
        },
      },
    },
  });
}

async function updateProductInDB(productId, productData) {
  await prisma.product.update({
    where: { product_id: productId },
    data: {
      product_name: productData.product_name,
      product_underline: productData.product_underline,
      product_description: productData.product_description,
      // Connect existing labels to the product
      labels: {
        connect: productData.labels.map((label_id) => ({ label_id })),
      },
      // Connect existing categories to the product
      categories: {
        connect: productData.categories.map((category_id) => ({ category_id })),
      },
      // Update related inventory
      inventory: {
        update: {
          inventory_stock: productData.inventory_stock,
        },
      },
    },
  });
  // Loop through the images and update them based on provided image_id
  for (let image of productData.images) {
    await prisma.productimage.update({
      where: { image_id: image.image_id },
      data: {
        image_url: image.image_url,
      },
    })
  }
  // Loop through the prices and update them based on provided price_id
  for (let price of productData.prices) {
    await prisma.price.update({
      where: { price_id: price.price_id },
      data: {
        price: price.price,
        starting_at: new Date(price.starting_at).toISOString(),
        is_campaign: price.is_campaign,
        ending_at: new Date(price.ending_at).toISOString(),
      },
    });
  }
}

async function deleteProductFromDB(productId) {
  // DELETE RELATIONS ON JUNCTION TABLES - USING RAW SQL, AS WE CANT ADD CASCADING DELETES ON MANY-TO-MANY IMPLICIT RELATION TABLES
  await prisma.$queryRaw`DELETE FROM _CategoryToProduct WHERE B = ${productId};`;
  await prisma.$queryRaw`DELETE FROM _LabelToProduct WHERE B = ${productId};`;
  await prisma.$queryRaw`DELETE FROM Productimage WHERE product_id = ${productId};`;
  await prisma.$queryRaw`DELETE FROM Inventory WHERE product_id = ${productId};`;
  await prisma.$queryRaw`DELETE FROM Price WHERE product_id = ${productId};`;
  await prisma.$queryRaw`DELETE FROM Order_item WHERE product_id = ${productId};`;

  // DELETE PRODUCT
  await prisma.product.delete({ where: { product_id: productId } });
}

// SEARCH FUNCTIONALITY
async function searchProductsFromDB(search, category, sort, label, userEmail) {
  // Define the where clause for the Prisma query
  let where = {};
  let products;
  let customerId;

  // Get the customer_id from the user_email only if userEmail is defined
  if (userEmail){
  customerId = await getCustomerIdFromUserEmail(userEmail);
  }

  // If a category is passed in the request query, add it to the where clause
  if (category) {
    where.categories = {
      some: {
        category_name: category,
      },
    };
  }
  // If a label is passed in the request query, add it to the where clause
  if (label) {
    where.labels = {
      some: {
        label_name: label,
      },
    };
  }
  // Fetch the products from the DB based on the where clause
  if (category || label) {
    products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        labels: true,
        categories: true,
        inventory: true,
        prices: true,
      },
    });
  } else {
    products = await prisma.product.findMany({
      include: {
        images: true,
        labels: true,
        categories: true,
        inventory: true,
        prices: true,
      },
    });
  }

  if (customerId) {
    // Fetch all favorites for the current user
    const userFavorites = await prisma.favorite.findMany({
      where: {
        customer_id: customerId,
      },
    });
  
    for (let product of products) {
      // Check if a favorite exists in the fetched favorites
      const userFavorite = userFavorites.find(favorite => favorite.product_id === product.product_id);
      // If a favorite is found, add its favorite_id to the product, if not return undefined
      product.favorite_id = userFavorite ? userFavorite.favorite_id : undefined;
    }
  }

  // Define the options for the Fuse.js search
  const options = {
    threshold: 0.4,
    keys: ["product_name"],
  };

  const fuse = new Fuse(products, options);
  let result = fuse.search(search);

  console.log(`Total results after search: ${result.length}`);
  // Map the Fuse search result to only return the product object
  result = result.map(({ item }) => item);
  // Sort the result if a sort query is passed
  if (sort) {
    result = sortProducts(result, sort);
  }
  return result;
}

async function getAllLabelsFromDB() {
  return await prisma.label.findMany();
}

async function getAllCategoriesFromDB() {
  return await prisma.category.findMany();
}

export { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB, searchProductsFromDB, getCustomerIdFromUserEmail, getAllLabelsFromDB, getAllCategoriesFromDB };
