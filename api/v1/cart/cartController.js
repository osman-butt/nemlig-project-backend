import cartModel from "./cartModel.js";

async function getCart(req, res) {
  // Get user
  const user_email = req.user_email;
  const user = await cartModel.getUsersByEmail(user_email);
  // Show cart if the user is a customer
  if (user?.customer) {
    try {
      const cart = await cartModel.getCartFromDb(user.customer.customer_id);
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
  const user_email = req.user_email;
  const user = await cartModel.getUsersByEmail(user_email);
  if (user?.customer) {
    try {
      const cart = await cartModel.getCartFromDb(user.customer.customer_id);
      if (cart == null) {
        return res.status(404).send({ message: "Cart does not exist." });
      }
      const updatedCart = await cartModel.createCartItemsInDb(
        cart.cart_id,
        cartItems
      );
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
  const user_email = req.user_email;
  const user = await cartModel.getUsersByEmail(user_email);
  if (user?.customer) {
    const cart = await cartModel.getCartFromDb(user.customer.customer_id);
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
        const updatedCart = await cartModel.createCartItemsInDb(
          cart.cart_id,
          cartItem
        );
        const updatedCartFromDB = await cartModel.getCartFromDb(
          user.customer.customer_id
        );
        res.json(updatedCartFromDB);
        // res.sendStatus(204);
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
        const updatedCart = await cartModel.deleteCartFromDb(
          Number(cart_item_id),
          Number(cartItem.product_id)
        );
        const updatedCartFromDB = await cartModel.getCartFromDb(
          user.customer.customer_id
        );
        res.json(updatedCartFromDB);
      } else {
        const updatedCart = await cartModel.updateCartItemQuantity(
          cart_item_id,
          newQuantity
        );
        const updatedCartFromDB = await cartModel.getCartFromDb(
          user.customer.customer_id
        );
        res.json(updatedCartFromDB);
      }
    }
  }
}

async function deleteAllCartItems(req, res) {
  // Get user
  const user_email = req.user_email;
  const user = await cartModel.getUsersByEmail(user_email);
  // Get cart id
  if (user?.customer) {
    const cart = await cartModel.getCartFromDb(user.customer.customer_id);
    if (cart == null) return res.sendStatus(204);
    const cart_id = cart.cart_id;
    try {
      await cartModel.deleteAllCartItemsFromDb(cart_id);
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
  deleteAllCartItems,
};
