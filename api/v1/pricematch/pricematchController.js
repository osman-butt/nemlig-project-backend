import { createPriceMatchPriceInDB } from "./pricematchModel.js";
import { fetchRema1000Products } from "../../../APIScraper/rema1000scraper.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createPriceMatchPrice(req, res) {
  try {
    const updatedProducts = await createPriceMatchPriceInDB();
    res.json({ msg: `Pricematch prices created!`, updatedProducts: updatedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create pricematch prices!" });
  }
}

async function scrapeRemaProducts(req, res) {
  try {
    const remaProducts = await fetchRema1000Products();

    const transaction = prisma.$transaction([
      prisma.scrapedProduct.deleteMany(),
      ...remaProducts.map((product) =>
        prisma.scrapedProduct.create({
          data: {
            product_id: product.product_id,
            name: product.name,
            prices: product.prices,
          },
        })
      ),
    ]);

    // execute transaction only if fetch succeeds
    await transaction;

    res.json({ msg: `Scraped products created!` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create scraped products!" });
  }
}

export default { createPriceMatchPrice, scrapeRemaProducts };
