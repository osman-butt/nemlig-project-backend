import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCartFromDb(customer_id) {
  return await prisma.cart.findFirst({
    where: {
      customer_id: customer_id,
    },
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

async function getUsersByEmail(email) {
  try {
    const users = await prisma.user.findFirst({
      where: {
        user_email: email,
      },
      include: {
        roles: true,
        customer: true,
      },
    });

    return users;
  } catch (error) {
    console.error(error);
  }
}

// async function createCartInDb(cartData) {
//   return await prisma.cart.create({
//     data: {
//       customer_id: cartData.customer_id,
//       cart_items: {
//         create: cartData.cart_items,
//       },
//     },
//   });
// }
async function createCartItemsInDb(cart_id, cartItems) {
  return await prisma.cart.update({
    where: {
      cart_id: cart_id,
    },
    data: {
      cart_items: {
        createMany: {
          data: cartItems,
        },
      },
    },
    include: {
      cart_items: true,
    },
  });
}

async function updateCartItemQuantity(cart_item_id, quantity) {
  return await prisma.cart_item.update({
    where: { cart_item_id: cart_item_id },
    data: {
      quantity: quantity,
    },
  });
}

async function updateCartInDb(cartData, cart_id) {
  const cartItems = await prisma.cart_item.findMany({
    where: { cart_id: cart_id },
  });

  for (let item of cartData.cart_items) {
    const cartItem = cartItems.find(
      cartItem => cartItem.cart_item_id === item.cart_item_id
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

async function deleteCartFromDb(cart_item_id, product_id) {
  return await prisma.cart_item.delete({
    where: {
      cart_item_id: cart_item_id,
      product_id: product_id,
    },
  });
}
// if (cartItem) {
//   await prisma.cart_item.delete({
//     where: {
//       cart_item_id: cartItem.cart_item_id,
//     },
//   });
// }
// }

async function deleteAllCartItemsFromDb(cart_id) {
  await prisma.cart.update({
    where: {
      cart_id: cart_id,
    },
    data: {
      cart_items: {
        deleteMany: {},
      },
    },
    include: {
      cart_items: true,
    },
  });
}

export {
  getCartFromDb,
  createCartItemsInDb,
  deleteCartFromDb,
  updateCartInDb,
  updateCartItemQuantity,
  getUsersByEmail,
  deleteAllCartItemsFromDb,
};
