import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import { sortProducts } from "../sortUtils/sortUtils.js";
import fs from "fs";

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
      // Disconnect all existing labels from the product
      labels: {
        set: [],
        // Connect existing labels to the product
        connect: productData.labels.map((label_id) => ({ label_id })),
      },
      // Disconnect all existing categories from the product
      categories: {
        set: [],
        // Connect existing categories to the product
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
  // Create new images and add their image_id to updatedImageIds
  const updatedImageIds = productData.images.map((image) => image.image_id).filter(Boolean);
  for (let image of productData.images) {
    if (!image.image_id) {
      const newImage = await prisma.productimage.create({
        data: {
          image_url: image.image_url,
          product_id: productId,
        },
      });
      updatedImageIds.push(newImage.image_id);
    }
  }

  // Delete all images that are not included in the updated images list
  await prisma.productimage.deleteMany({
    where: {
      product_id: productId,
      image_id: {
        notIn: updatedImageIds,
      },
    },
  });

  // Create new prices and add their price_id to updatedPriceIds
  const updatedPriceIds = productData.prices.map((price) => price.price_id).filter(Boolean);
  for (let price of productData.prices) {
    if (!price.price_id) {
      const newPrice = await prisma.price.create({
        data: {
          price: price.price,
          starting_at: new Date(price.starting_at).toISOString(),
          is_campaign: Boolean(price.is_campaign),
          ending_at: new Date(price.ending_at).toISOString(),
          product_id: productId,
        },
      });
      updatedPriceIds.push(newPrice.price_id);
    }
  }

  // Delete all prices that are not included in the updated prices list
  await prisma.price.deleteMany({
    where: {
      product_id: productId,
      price_id: {
        notIn: updatedPriceIds,
      },
    },
  });
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

// PRICEMATCHING
async function createPriceMatchPriceInDB(){

  // Read the scraped data
  const data = fs.readFileSync('rema1000Products.json');
  const remaProducts = JSON.parse(data);

  // Fetch all products from DB with associated prices
  const allProducts = await prisma.product.findMany({
    include: {
      prices: true,
    }
  })

  let updatedProducts = [];

  // Convert allProducts to a Map for faster lookup
  const productMap = new Map(allProducts.map(product => [product.product_id, product]));

  // Loop over the scraped products
  for (let remaProduct of remaProducts){

    // Fetch corresponding product from DB
    const ourProduct = productMap.get(remaProduct.product_id);

    if (!ourProduct) continue; // If the product does not exist in our DB, skip it

    // Compare the prices
    for (let remaPrice of remaProduct.prices){
    const ourPrice = ourProduct.prices[0].price;
    if (ourPrice > remaPrice.price) {
      // Create a new price in our database
      const newPrice = await prisma.price.create({
      data: {
      price: remaPrice.price,
      product_id: ourProduct.product_id,
      is_campaign: true,
      starting_at: new Date(remaPrice.starting_at).toISOString(),
      ending_at: new Date(remaPrice.ending_at).toISOString(),
      }
      });

      // Add the updated product to the updatedProducts array
      updatedProducts.push({ product_id: ourProduct.product_id, oldPrice: ourPrice, newPrice: newPrice.price });
    }
    }
  }
  return updatedProducts;
}

// GET PRODUCT IDS FOR PRICEMATCH
async function getProductIdsFromDB(){
  const products = await prisma.product.findMany({
    select: {
      product_id: true,
    }
  })

  return products.map(product => product.product_id);
}
export { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB, searchProductsFromDB, getCustomerIdFromUserEmail, getAllLabelsFromDB, getAllCategoriesFromDB, createPriceMatchPriceInDB, getProductIdsFromDB };
