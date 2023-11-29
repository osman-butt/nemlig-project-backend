import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getOrdersFromDB() {
  return await prisma.order.findMany({
    // WHICH RELATIONS TO INCLUDE IN THE RESPONSE?
    include: {
      order_items: true,
      // include: {
      // products: true,
      // }
    },
  });
}

// CREATE A NEW ORDER IN THE DATABASE
async function createOrderInDB(orderData) {
  return await prisma.order.create({
    data: {
      customer_id: orderData.customer_id,
      address_id: orderData.address_id,
      order_date: new Date(orderData.order_date).toISOString(),
      order_items: {
        create: orderData.order_items
      }
    },
  });
}

export { getOrdersFromDB, createOrderInDB };