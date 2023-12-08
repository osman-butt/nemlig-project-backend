import cartModel from "../cart/cartModel.js";
import customerModel from "../customer/customerModel.js";
import {
  getOrdersFromDB,
  createOrderInDB,
  getInventoryFromDB,
  updateInventoryInDB,
  updateCartInDB,
  getCartFromDb,
} from "./ordersModel.js";

async function getOrders(req, res) {
  try {
    const orders = await getOrdersFromDB();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch orders" });
  }
}

// EXPECTED POST BODY
// {
//     "customer_id": 17,
//     "address_id": 16,
//     "order_items": [
//         {
//             "product_id": 211190,
//             "quantity": 1
//         }
//     ]
// }

async function getInventory(req, res) {
  const body = {
    customer_id: 17,
    address_id: 16,
    order_items: [
      {
        product_id: 211190,
        quantity: 1,
      },
      {
        product_id: 100004,
        quantity: 1,
      },
      {
        product_id: 100021,
        quantity: 1,
      },
    ],
  };
  const productListIds = body.order_items.map(item => ({
    product_id: item.product_id,
  }));
  console.log(productListIds);
  const inventory = await getInventoryFromDB(productListIds);
  res.send(inventory);
}

async function createOrderItems(req, res) {
  // TODO:
  // When added auth, remove hard coded email
  // BUG: Cart_items sometimes has zero quantity, this should
  // be removed from DB
  // Get user
  const user_email = "customer2@mail.dk"; //req.user_email;
  const user = await customerModel.getCustomerFromEmail(user_email);
  const customer = user?.customer;
  if (customer == null || customer?.addresses[0] == null) {
    res.status(404).send({ message: "Kunden eksisterer ikke." });
  }

  // Get cart
  const cart = await getCartFromDb(customer.customer_id);
  cart.cart_items = cart.cart_items.filter(item => item.quantity !== 0);
  console.log(cart.cart_items);
  if (cart.cart_items.length == 0) {
    return res.status(404).send({ message: "Kurven er tom" });
  }

  // Get product ids
  const productListIds = cart.cart_items.map(item => ({
    product_id: item.product_id,
  }));

  // Get inventory from product ids
  const inventory = await getInventoryFromDB(productListIds);

  // Subtract inventory logic
  inventory.forEach(async product => {
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
      await updateCartInDB(cart_item_id, cart.cart_items[index].quantity);

      // // GET Cart again
      const updatedCart = await getCartFromDb(customer.customer_id);
      updatedCart.message =
        "Kurven er opdateret da nogle produkter ikke var på lager med den ønskede mængde";
      // Send as error with new updated cart
      return res.status(404).json(updatedCart);
    }

    try {
      // TODO:
      // GET CORRECT unit_price_at_purchase
      // NOTE THIS OPERATION SHOULD BE ATOMIC!!!

      // Update inventory
      inventory.forEach(async product => {
        await updateInventoryInDB(product);
      });

      // Create order and order items

      // Create objects for prisma db
      const newItems = cart.cart_items.map(product => ({
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price_at_purchase: 10,
      }));

      const orderData = {
        customer_id: customer.customer_id,
        address_id: customer.addresses[0].address_id,
        order_items: newItems,
      };

      // Delete items in cart
      await cartModel.deleteAllCartItemsFromDb(cart.cart_id);

      // Create order with order items
      const newOrder = await createOrderInDB(orderData);

      res.send(newOrder);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  // // Return new cart

  // res.send({ inventory, orderItems });
  // // Construct data for db
  // const newOrderItems = {
  //   customer_id: customer.customer_id,
  //   order_date: new Date().toISOString(),
  //   address_id: customer.addresses[0].address_id,
  //   order_items: orderItems, // and array of objects containing product_id and quantity and unit_price_at_purchase
  // };

  // try {
  //   // TODO:
  //   // CREATE IN DATABASE
  //   // RETRIEVE Order ID and send to client
  // } catch (error) {
  //   console.log(error);
  //   res.sendStatus(500);
  // }
}
async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const newOrder = await createOrderInDB(orderData);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Could not create order" });
  }
}

export default { getOrders, createOrder, getInventory, createOrderItems };
