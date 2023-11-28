import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getOrdersFromDB() {
  return await prisma.order.findMany({
    // WHICH RELATIONS TO INCLUDE IN THE RESPONSE?
    include: {
      
    },
  });
}

// CREATE A NEW ORDER IN THE DATABASE
async function createOrderInDB(orderData) {
  return await prisma.order.create({
    data: {
      // WHICH DATA TO INSERT?
      
    },
  });
}

export { getOrdersFromDB, createOrderInDB };