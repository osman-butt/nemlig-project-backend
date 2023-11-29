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
async function createOrderInDB(customer_id, adress_id) {
  return await prisma.order.create({
    data: {
      // WHICH DATA TO INSERT?
      customer_id: customer_id,
      adress_id: adress_id,
    },
  });
}

export { getOrdersFromDB, createOrderInDB };