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
      products: {
        connect: cartData.products.map((product) => ({ id: product.id })),
      },
      quantity: cartData.quantity,
    },
  });
}

export { getCartFromDb, createCartInDb };
