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

async function updateInventoryInDB(inventory) {
  return await prisma.inventory.update({
    where: {
      product_id: inventory.product_id,
    },
    data: {
      inventory_stock: inventory.inventory_stock,
    },
  });
}

// CREATE A NEW ORDER IN THE DATABASE
async function createOrderInDB(orderData) {
  return await prisma.order.create({
    data: {
      customer_id: orderData.customer_id,
      address_id: orderData.address_id,
      order_date: new Date().toISOString(),
      order_items: {
        createMany: {
          data: orderData.order_items,
        },
      },
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

export {
  getOrdersFromDB,
  createOrderInDB,
  getInventoryFromDB,
  updateInventoryInDB,
  updateCartInDB,
  getCartFromDb,
};
