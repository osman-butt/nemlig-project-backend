import { getCartFromDb, createCartInDb, deleteCartFromDb } from "./cartModel.js";

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


async function deleteCart(req, res) {
  const cart_id = parseInt(req.params.id);
  await deleteCartFromDb(cart_id);
  res.json({ message: `Cart with id ${cart_id} was deleted` });
 
}


export default { getCart, createCart, deleteCart };