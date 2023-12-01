import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCartFromDb() {
  return await prisma.cart.findMany({
    include: {
      cart_items: {
        include: {
          products: true,
        },
      },
      customers: true,
    },
  });
}

async function createCartInDb(cartData) {
  return await prisma.cart.create({
    data: {
      customer_id: cartData.customer_id,
      products: {
        connect: cartData.products.map(product => ({ id: product.id })),
      },
      quantity: cartData.quantity,
    },
  });
}

async function deleteCartFromDb(cart_id) {
  await prisma.$queryRaw`DELETE FROM _carttoproduct WHERE A = ${cart_id}`;
  await prisma.cart.delete({ where: { cart_id: cart_id } });
}

export { getCartFromDb, createCartInDb, deleteCartFromDb };
