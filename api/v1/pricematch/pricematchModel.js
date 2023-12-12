import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PRICEMATCHING
async function createPriceMatchPriceInDB() {
  // Fetch all products from DB with associated prices
  const allProducts = await prisma.product.findMany({
    include: {
      prices: true,
    },
  });

  // Fetch all scraped products from DB
  const remaProducts = await prisma.scrapedProduct.findMany();

  // Delete outdated pricematch prices
  await prisma.price.deleteMany({
    where: {
      is_pricematch: true,
      ending_at: {
        lt: new Date(),
      },
    },
  });

  let updatedProducts = [];

  // Convert allProducts to a Map for faster lookup
  const productMap = new Map(allProducts.map((product) => [product.product_id, product]));

  // Loop over the scraped products
  for (let remaProduct of remaProducts) {
    // Fetch corresponding product from DB
    const ourProduct = productMap.get(remaProduct.product_id);

    if (!ourProduct) continue; // If the product does not exist in our DB, skip it

    // Find the lowest price of our product
    const ourLowestPrice = Math.min(...ourProduct.prices.map((price) => price.price));

    // Compare the prices
    for (let remaPrice of remaProduct.prices) {
      if (ourLowestPrice > remaPrice.price) {
        // Check if the new price already exists in our DB
        const existingPrice = ourProduct.prices.find((price) => price.price === remaPrice.price);
        if (!existingPrice) {
          // Create a new price in our database
          const newPrice = await prisma.price.create({
            data: {
              price: remaPrice.price,
              product_id: ourProduct.product_id,
              is_campaign: false,
              is_pricematch: true,
              starting_at: new Date(remaPrice.starting_at).toISOString(),
              ending_at: new Date(remaPrice.ending_at).toISOString(),
            },
          });

          // Add the updated product to the updatedProducts array
          updatedProducts.push({ product_id: ourProduct.product_id, oldPrice: ourLowestPrice, newPrice: newPrice.price });
        }
      }
    }
  }
  return updatedProducts;
}

// GET PRODUCT IDS FOR PRICEMATCH
async function getProductIdsFromDB() {
  const products = await prisma.product.findMany({
    select: {
      product_id: true,
    },
  });

  return products.map((product) => product.product_id);
}

export { createPriceMatchPriceInDB, getProductIdsFromDB };
