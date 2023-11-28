import { getCartFromDb } from "./cartModel.js";

async function getCart(req, res) {
  const cart = await getCartFromDb();
  res.json(cart);
}

export default { getCart };
