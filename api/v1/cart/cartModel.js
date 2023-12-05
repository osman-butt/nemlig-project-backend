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
      cart_items: {
        create: cartData.cart_items,
      },
    },
  });
}

async function updateCartInDb(cartData, cart_id) {
  const cartItems = await prisma.cart_item.findMany({
    where: { cart_id: cart_id },
  });

  for (let item of cartData.cart_items) {
    const cartItem = cartItems.find(
      (cartItem) => cartItem.cart_item_id === item.cart_item_id
    );
    if (cartItem) {
      await prisma.cart_item.update({
        where: { cart_item_id: item.cart_item_id },
        data: {
          quantity: item.quantity,
        },
      });
    }
  }
}

async function deleteCartFromDb(cart_id, product_id) {
  const cartItem = await prisma.cart_item.findFirst({
    where: {
      cart_id: parseInt(cart_id),
      product_id: parseInt(product_id),
    },
  });

  if (cartItem) {
    await prisma.cart_item.delete({
      where: {
        cart_item_id: cartItem.cart_item_id,
      },
    });
  }
}

export { getCartFromDb, createCartInDb, deleteCartFromDb, updateCartInDb };
