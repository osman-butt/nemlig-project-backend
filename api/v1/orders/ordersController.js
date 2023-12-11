// import cartModel from "../cart/cartModel.js";
import customerModel from "../customer/customerModel.js";
import ordersModel from "./ordersModel.js";

import { getValidPrice } from "./orderUtils.js";

async function getOrders(req, res) {
  try {
    const orders = await ordersModel.getOrdersFromDB();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch orders" });
  }
}

async function createOrderItems(req, res) {
  // Get Payment info
  const payment = req.body;
  if (
    payment?.cardNo.length < 16 ||
    payment?.expiry.length < 4 ||
    payment?.cvc.length < 3
  ) {
    return res.status(404).send({ message: "Betalings oplysninger mangler." });
  }
  // Get user
  const user_email = req.user_email;
  if (user_email == null || user_email == undefined) {
    return res.status(403).send({ message: "Brugeren er ikke logget ind." });
  }
  const user = await customerModel.getCustomerFromEmail(user_email);
  const customer = user?.customer;
  if (customer == null || customer?.addresses[0] == null) {
    return res.status(404).send({ message: "Kunden eksisterer ikke." });
  }

  // Get cart
  const cart = await ordersModel.getCartFromDb(customer.customer_id);
  cart.cart_items = cart.cart_items.filter(item => item.quantity !== 0);
  if (cart.cart_items.length == 0) {
    return res.status(404).send({ message: "Kurven er tom" });
  }

  // Get product ids
  const productListIds = cart.cart_items.map(item => ({
    product_id: item.product_id,
  }));

  // Get inventory from product ids
  const inventory = await ordersModel.getInventoryFromDB(productListIds);
  // Subtract inventory logic
  let isCartUpdated = false;
  for (const product of inventory) {
    // Find product body.req
    const index = cart.cart_items.findIndex(
      item => item.product_id == product.product_id
    );
    const requestedQuantity = cart.cart_items[index].quantity;
    if (product.inventory_stock >= requestedQuantity) {
      // Update inventory
      product.inventory_stock = product.inventory_stock - requestedQuantity;
    } else {
      // Update cart quantity
      cart.cart_items[index].quantity = product.inventory_stock;
      // Update Cart
      // Get cart_item_id
      const index_cart_item = cart.cart_items.findIndex(
        item => item.product_id === product.product_id
      );
      const cart_item_id = cart.cart_items[index_cart_item].cart_item_id;
      // Delete from cart if quantity = 0, else update cart
      if (product.inventory_stock === 0) {
        await ordersModel.deleteCartItemInDB(cart_item_id);
      } else {
        await ordersModel.updateCartInDB(
          cart_item_id,
          cart.cart_items[index].quantity
        );
      }
      isCartUpdated = true;
    }
  }

  try {
    if (isCartUpdated) {
      // // GET Cart again
      const updatedCart = await ordersModel.getCartFromDb(customer.customer_id);
      updatedCart.message =
        "Kurven er opdateret da nogle produkter ikke var på lager med den ønskede mængde";
      // Send as error with new updated cart
      return res.status(404).json(updatedCart);
    } else {
      // Create objects for prisma db
      const newItems = cart.cart_items.map(product => ({
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price_at_purchase: getValidPrice(product.products.prices),
      }));

      const orderData = {
        customer_id: customer.customer_id,
        address_id: customer.addresses[0].address_id,
        order_items: newItems,
      };

      const newOrder = await ordersModel.createOrderTransaction(
        inventory,
        cart,
        orderData
      );
      return res.send(newOrder);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export default { getOrders, createOrderItems };
