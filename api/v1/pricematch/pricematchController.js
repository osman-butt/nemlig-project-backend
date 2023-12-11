import { createPriceMatchPriceInDB } from "./pricematchModel.js";

async function createPriceMatchPrice(req, res){
    try {
      const updatedProducts = await createPriceMatchPriceInDB();
      res.json({ msg: `Pricematch prices created!`, updatedProducts: updatedProducts});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to create pricematch prices!" });
    }
  }
  
  export default {createPriceMatchPrice};