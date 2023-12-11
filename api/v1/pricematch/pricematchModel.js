import {PrismaClient} from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

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

  export { createPriceMatchPriceInDB, getProductIdsFromDB}