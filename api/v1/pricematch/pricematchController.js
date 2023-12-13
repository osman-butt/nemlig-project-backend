import { createPriceMatchPriceInDB, deleteOutdatedPriceMatchPricesInDB } from "./pricematchModel.js";
import { fetchRema1000Products } from "../../../APIScraper/rema1000scraper.js";

async function createPriceMatchPrice(req, res) {
  try {
    const remaProducts = await fetchRema1000Products();
    const updatedProducts = await createPriceMatchPriceInDB(remaProducts);
    res.json({ msg: `Pricematch prices created!`, updatedProducts: updatedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create pricematch prices!" });
  }
}

async function deleteOutdatedPriceMatchPrices(req, res) {
  try {
    await deleteOutdatedPriceMatchPricesInDB();
    res.json({ msg: `Outdated pricematch prices deleted!` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete outdated pricematch prices!" });
  }
}

export default { createPriceMatchPrice, deleteOutdatedPriceMatchPrices };
