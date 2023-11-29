import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCartFromDb() {
  return await prisma.cart.findMany({
    include: {
      products: true,
      customers: true,
    },
  });
}

async function createCartInDb(cartData) {
  return await prisma.cart.create({
    data: {
      customer_id: cartData.customer_id,
      product_id: cartData.product_id,
      quantity: cartData.quantity,
    },
  });
}

export { getCartFromDb, createCartInDb };
