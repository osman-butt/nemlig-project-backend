import { getCartFromDb, createCartInDb } from "./cartModel.js";

async function getCart(req, res) {
  const cart = await getCartFromDb();
  res.json(cart);
}

async function createCart(req, res) {
  const cartData = req.body;
  const newCart = await createCartInDb(cartData);
  console.log(`newCart: ${newCart}`);

  res.json(newCart);
}

export default { getCart, createCart };
