import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getOrdersFromDB() {
  return await prisma.order.findMany({
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });
}

async function getInventoryFromDB(productListIds) {
  return await prisma.inventory.findMany({
    where: {
      OR: productListIds,
    },
  });
}

async function updateCartInDB(cart_item_id, quantity) {
  return await prisma.cart_item.update({
    where: { cart_item_id: cart_item_id },
    data: {
      quantity: quantity,
    },
  });
}

async function deleteCartItemInDB(cart_item_id) {
  return await prisma.cart_item.delete({
    where: { cart_item_id: cart_item_id },
  });
}

async function getCartFromDb(customer_id) {
  return await prisma.cart.findFirst({
    where: {
      customer_id: customer_id,
    },
    include: {
      cart_items: {
        include: {
          products: {
            include: {
              images: true,
              labels: true,
              categories: true,
              inventory: true,
              prices: true,
            },
          },
        },
      },
      customers: true,
    },
  });
}

async function createOrderTransaction(inventory, cart, order) {
  // Transaction:
  // Update inventory
  // create order and order_items from cart
  // Delete cart
  return prisma.$transaction(async tx => {
    // 1. Update inventory for each product
    const newInventory = await inventory.forEach(async product => {
      return await prisma.inventory.update({
        where: {
          product_id: product.product_id,
        },
        data: {
          inventory_stock: product.inventory_stock,
        },
      });
    });
    // 2. Create order and order_items
    const newOrder = await prisma.order.create({
      data: {
        customer_id: order.customer_id,
        address_id: order.address_id,
        order_date: new Date().toISOString(),
        order_items: {
          createMany: {
            data: order.order_items,
          },
        },
      },
    });

    // 3. Delete cart
    const newCart = await prisma.cart.update({
      where: {
        cart_id: cart.cart_id,
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
    return newOrder;
  });
}

export default {
  getOrdersFromDB,
  getInventoryFromDB,
  updateCartInDB,
  deleteCartItemInDB,
  getCartFromDb,
  createOrderTransaction,
};
