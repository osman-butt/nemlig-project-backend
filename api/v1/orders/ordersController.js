import { getOrdersFromDB, createOrderInDB } from "./ordersModel.js";

async function getOrders(req, res) {
  try {
    const orders = await getOrdersFromDB();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch orders' });
  }
}

async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const newOrder = await createOrderInDB(orderData);
    res.json(newOrder );
  } catch (error) {
    res.status(500).json({ message: 'Could not create order'});
  }
}

export default { getOrders, createOrder };
