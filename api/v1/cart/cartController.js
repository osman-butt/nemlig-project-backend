import {
  getCartFromDb,
  createCartInDb,
  deleteCartFromDb,
  updateCartInDb,
  getUsersByEmail,
} from "./cartModel.js";

async function getCart(req, res) {
  // Get user
  const user_email = "customer2@mail.dk"; // req.user_email;
  const user = await getUsersByEmail(user_email);
  // Show cart if the user is a customer
  if (user?.customer) {
    const cart = await getCartFromDb(user.customer.customer_id);
    res.json(cart);
  } else {
    res.json([]);
  }
}

async function createCart(req, res) {
  const cartData = req.body;
  const newCart = await createCartInDb(cartData);
  console.log(`newCart: ${newCart}`);

  res.json(newCart);
}

async function updateCart(req, res) {
  const cart_id = parseInt(req.params.id);
  const cartData = req.body;
  await updateCartInDb(cartData, cart_id);
  res.json({ message: `Cart with id ${cartData.cart_id} was updated` });
}

async function deleteCart(req, res) {
  const { cart_id, product_id } = req.params;
  await deleteCartFromDb(cart_id, product_id);
  res.json({
    message: `Deletion successful for cart_id: ${cart_id}, product_id: ${product_id}`,
  });
}

export default { getCart, createCart, deleteCart, updateCart };
