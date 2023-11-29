import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getOrdersFromDB() {
  return await prisma.order.findMany({
    include: {
      order_items: {
        include: {
          products: true,
        }
      },
    },
  });
}

// CREATE A NEW ORDER IN THE DATABASE
async function createOrderInDB() {
  return await prisma.order.create({
    data: {
      // WHICH DATA TO INSERT?
      
    }
  });
}

export { getOrdersFromDB, createOrderInDB };