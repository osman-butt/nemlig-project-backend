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
  const cartEntryId = req.params.id;

  const deletedCart = await deleteCartFromDb(cartEntryId);
  console.log(`Deleted cart: ${deletedCart}`);

  res.json({ message: 'Cart deleted successfully', cart: deletedCart });
}


export default { getCart, createCart };
