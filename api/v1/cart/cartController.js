import {
  getCartFromDb,
  createCartItemsInDb,
  deleteCartFromDb,
  updateCartInDb,
  getUsersByEmail,
  deleteAllCartItemsFromDb,
  updateCartItemQuantity,
} from "./cartModel.js";

const EMAIL = "customer@mail.dk";

async function getCart(req, res) {
  // Get user
  const user_email = EMAIL; // req.user_email;
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

async function createCartItems(req, res) {
  const cartItems = req.body;
  // Get user
  const user_email = EMAIL; // req.user_email;
  const user = await getUsersByEmail(user_email);
  if (user?.customer) {
    try {
      const cart = await getCartFromDb(user.customer.customer_id);
      if (cart == null) {
        return res.status(404).send({ message: "Cart does not exist." });
      }
      const updatedCart = await createCartItemsInDb(cart.cart_id, cartItems);
      res.send(updatedCart);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
}

async function updateCartItem(req, res) {
  const cartItem = req.body;
  // Get user
  const user_email = EMAIL; // req.user_email;
  const user = await getUsersByEmail(user_email);
  if (user?.customer) {
    const cart = await getCartFromDb(user.customer.customer_id);
    if (cart == null) {
      return res.status(404).send({ message: "Cart does not exist." });
    }
    // Does the product exist in cart?
    const index = cart.cart_items.findIndex(
      item => item.product_id === Number(cartItem.product_id)
    );
    if (index === -1) {
      // If no - add product to cart
      if (Number(cartItem.quantity) > 0) {
        const updatedCart = await createCartItemsInDb(cart.cart_id, cartItem);
        res.sendStatus(204);
      } else {
        res.status(404).send({ message: "Product not in cart" });
      }
    } else {
      // If yes - Increment or decrement quantity
      const cart_item_id = cart.cart_items[index].cart_item_id;
      const newQuantity =
        cart.cart_items[index].quantity + Number(cartItem.quantity);
      console.log();
      // if newQuantity = 0 ? delete : update;
      if (newQuantity < 1) {
        const updatedCart = await deleteCartFromDb(
          Number(cart_item_id),
          Number(cartItem.product_id)
        );
        res.sendStatus(204);
      } else {
        const updatedCart = await updateCartItemQuantity(
          cart_item_id,
          newQuantity
        );
        res.sendStatus(204);
      }
    }
  }
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

async function deleteAllCartItems(req, res) {
  // Get user
  const user_email = EMAIL; // req.user_email;
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

export default {
  getCart,
  createCartItems,
  updateCartItem,
  // deleteCart,
  // updateCart,
  deleteAllCartItems,
};
