import { getOrdersFromDB, createOrderInDB } from "./ordersModel.js";

async function getOrders(req, res) {
  try {
    const orders = await getOrdersFromDB();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch orders', message: error.message });
  }
}

async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const newOrder = await createOrderInDB(orderData);
    res.json(newOrder );
  } catch (error) {
    res.status(500).json({ error: 'Could not create order', message: error.message });
  }
}

export default { getOrders, createOrder };
