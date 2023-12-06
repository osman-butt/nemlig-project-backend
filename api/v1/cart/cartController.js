import {
  getCartFromDb,
  createCartItemsInDb,
  deleteCartFromDb,
  updateCartInDb,
  getUsersByEmail,
  deleteAllCartItemsFromDb,
} from "./cartModel.js";

async function getCart(req, res) {
  // Get user
  const user_email = "customer2@mail.dk"; // req.user_email;
  const user = await getUsersByEmail(user_email);
  // Show cart if the user is a customer
  if (user?.customer) {
    try {
      const cart = await getCartFromDb(user.customer.customer_id);
      res.json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  } else {
    res.json([]);
  }
}

// async function createCartItem(req, res) {
//   const newItems = req.body;
//   // Get user
//   const user_email = "customer2@mail.dk"; // req.user_email;
//   const user = await getUsersByEmail(user_email);
//   if (user?.customer) {
//     const cart = await getCartFromDb(user.customer.customer_id);
//     // Check if product already exist in cart
//     if (cart?.cart_items.length > 0) {
//       const items = cart.cart_items;
//       for (const item of newItems) {
//         const index = items.findIndex(
//           cartItem => cartItem.product_id === item.product_id
//         );
//         if (index > -1) {
//         }
//       }
//     }
//   }
//   const newCart = await createCartItemsInDb(cartItems);
//   console.log(`newCart: ${newCart}`);

//   res.json(newCart);
// }

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

async function deleteAllCartItems(req, res) {
  // Get user
  const user_email = "customer@mail.dk"; // req.user_email;
  const user = await getUsersByEmail(user_email);
  // Get cart id
  if (user?.customer) {
    const cart = await getCartFromDb(user.customer.customer_id);
    if (cart == null) return res.sendStatus(204);
    const cart_id = cart.cart_id;
    try {
      await deleteAllCartItemsFromDb(cart_id);
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
}

export default { getCart, deleteCart, updateCart, deleteAllCartItems };
