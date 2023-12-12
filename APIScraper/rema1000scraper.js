import axios from "axios";
import fs from "fs";
import { getProductIdsFromDB } from "../api/v1/pricematch/pricematchModel.js";

// Function to delay the requests to the API so we dont get timed out
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetchRema1000Products() {
  let remaproducts = [];
  let page = 1;
  let hasMoreData = true;

  // Fetch product IDS from our DB
  const ourProductIds = await getProductIdsFromDB();

  while (hasMoreData) {
    console.log(`Fetching page ${page}...`);
    try {
      const response = await axios.get(`https://cphapp.rema1000.dk/api/v3/products?page=${page}`);
      const products = response.data.data;

      // Filter products based on our product IDS, and if they have multiple prices
      const matchingProducts = products.filter((product) => ourProductIds.includes(product.id) && product.prices.length > 1);

      // Map over matching products and create new object for each product that only includes the data we need
      const formattedProducts = matchingProducts.map((product) => ({
        product_id: product.id,
        name: product.name,
        prices: product.prices,
      }));

      remaproducts = remaproducts.concat(formattedProducts);
      hasMoreData = response.data.meta.pagination.links.next !== null;
      page++;
      await delay(5000);
    } catch (error) {
      console.log(`Error fetching page ${page}: ${error}`);
      hasMoreData = false;
    }
  }
  return remaproducts;
}

fetchRema1000Products()
  .then((products) => {
    fs.writeFileSync("rema1000Products.json", JSON.stringify(products, null, 2));
    console.log("Data written to file");
  })
  .catch((error) => {
    console.error(`Error running scraper: ${error}`);
  });

export { fetchRema1000Products };
