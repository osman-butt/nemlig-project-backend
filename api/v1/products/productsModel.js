import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

async function getProductsFromDB(category) {
  if (category) {
    return await prisma.product.findMany({
      where: {
        categories: {
          some: {
            category_name: category,
          },
        },
      },
      include: {
        //productimages: true,
        labels: true,
        categories: true,
        inventory: true,
        prices: true,
      },
    });
  } else {
    return await prisma.product.findMany({
      include: {
        //productimages: true,
        labels: true,
        categories: true,
        inventory: true,
        prices: true,
      },
    });
  }
}

async function getProductByIdFromDB(productId) {
  return await prisma.product.findUnique({
    where: { product_id: productId },
    include: {
      // productimages: true,
      labels: true,
      categories: true,
      inventory: true,
      prices: true,
    },
  });
}

async function postProductsInDB(productData) {
  return await prisma.product.create({
    data: {
      product_name: productData.product_name,
      product_underline: productData.product_underline,
      product_description: productData.product_description,
      labels: {
        // DETTE ANTAGER AT LABELS HAR ET MANGE-TIL-MANGE FORHOLD TIL PRODUKTER
        connect: productData.labels.map((label) => ({ label_id: label })),
      },
      categories: {
        // DETTE ANTAGER AT KATEGORIER HAR ET MANGE-TIL-MANGE FORHOLD TIL PRODUKTER
        connect: productData.categories.map((category) => ({ category_id: category })),
      },
      inventory: {
        create: {
          inventory_stock: productData.inventory_stock,
        },
      },
      prices: {
        create: {
          price: productData.price,
          starting_at: new Date(productData.starting_at).toISOString(),
          is_campaign: productData.is_campaign,
          ending_at: new Date(productData.ending_at).toISOString(),
        },
      },
    },
  });
}

// DENNE ER MÅSKE LIDT PROBLEMATISK HVIS VI HAR MANGE PRISER PÅ ET PRODUKT, DA DEN VIL OPDATERE ALLE PRISER PÅ ET PRODUKT, EFTERSOM DEN GÅR UD FRA PRODUKT ID
async function updateProductInDB(productId, productData) {
  await prisma.product.update({
    where: { product_id: productId },
    data: {
      product_name: productData.product_name,
      product_underline: productData.product_underline,
      product_description: productData.product_description,
      labels: {
        connect: productData.labels.map((label_id) => ({ label_id })),
      },
      categories: {
        connect: productData.categories.map((category_id) => ({ category_id })),
      },
      inventory: {
        update: {
          inventory_stock: productData.inventory_stock,
        },
      },
    },
  });

  await prisma.price.updateMany({
    where: {
      product_id: productId,
    },
    data: {
      price: productData.price,
      starting_at: new Date(productData.starting_at).toISOString(),
      is_campaign: productData.is_campaign,
      ending_at: new Date(productData.ending_at).toISOString(),
    },
  });
}

// DENNE VIL KIGGE PÅ ET PRICES ARRAY SOM SKAL FØLGE MED I PRODUCTDATA OG LOOPE IGENNEM DETTE OG SÅ OPDATERE BASERET PÅ PRICE_ID
// PRODUCT DATAEN VILLE SÅ SKULLE SE NOGENLUNDE SÅDAN HER UD:

// {
//   "product_name": "UpdateTest",
//   "product_underline": "200g",
//   "product_description": "This is a test product",
//   "labels": [9],
//   "categories": [1],
//   "inventory_stock": 5,
//   "prices": [
//     {
//       "price_id": 1326,
//       "price": 14.99,
//       "starting_at": "2022-02-02",
//       "is_campaign": false,
//       "ending_at": "2023-02-02"
//     },
//     {
//       "price_id": 1327,
//       "price": 15.99,
//       "starting_at": "2022-03-02",
//       "is_campaign": true,
//       "ending_at": "2023-03-02"
//     }
//   ]
// }

// async function updateIfMorePricesInDB(productId, productData){
//         await prisma.product.update({
//         where: { product_id: productId },
//         data: {
//             product_name: productData.product_name,
//             product_underline: productData.product_underline,
//             product_description: productData.product_description,
//             labels: {
//                 connect: productData.labels.map(label_id => ({ label_id })),
//             },
//             categories: {
//                 connect: productData.categories.map(category_id => ({ category_id })),
//             },
//             inventory: {
//                 update: {
//                     inventory_stock: productData.inventory_stock,
//                 }
//             },
//         }
//     });

//     for (let price of productData.prices) {
//         await prisma.price.update({
//             where: { price_id: price.price_id },
//             data: {
//                 price: price.price,
//                 starting_at: new Date(price.starting_at).toISOString(),
//                 is_campaign: price.is_campaign,
//                 ending_at: new Date(price.ending_at).toISOString(),
//             }
//         });
//     }
// }

async function deleteProductFromDB(productId) {
  // DELETE RELATIONS ON JUNCTION TABLES - USING RAW SQL, AS WE CANT ADD CASCADING DELETES ON MANY-TO-MANY IMPLICIT RELATION TABLES
  await prisma.$queryRaw`DELETE FROM _CategoryToProduct WHERE B = ${productId};`;
  await prisma.$queryRaw`DELETE FROM _LabelToProduct WHERE B = ${productId};`;
  await prisma.$queryRaw`DELETE FROM Inventory WHERE product_id = ${productId};`;
  await prisma.$queryRaw`DELETE FROM Price WHERE product_id = ${productId};`;

  // DELETE PRODUCT
  await prisma.product.delete({ where: { product_id: productId } });
}

// SEARCH FUNCTIONALITY
async function searchProductsFromDB(search, category) {
  let products;
  if (category) {
    products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            category_name: category,
          },
        },
  },
  include: {
    //productimages: true,
    labels: true,
    categories: true,
    inventory: true,
    prices: true,
  },
  });
  } else {
  products = await prisma.product.findMany({
    include: {
      //productimages: true,
      labels: true,
      categories: true,
      inventory: true,
      prices: true,
    },
  });
}

  console.log(`Total results before search: ${products.length}`);


  const options = {
    // includeScore: true,
    // includeMatches: true,
    threshold: 0.4,
    //limit: 5,
    keys: ["product_name"],
  };

  const fuse = new Fuse(products, options);

  const result = fuse.search(search);

  console.log(`Total results after search: ${result.length}`);

 // return result.map(({item}) => item) // IF WE WANT THE SAME STRUCTURE AS OUR NORMAL GET REQUEST 
  return result; // THIS RETURNS EACH PRODUCT IN AN ITEM OBJECT WHERE SCORE AND MATCHES CAN BE INCLUDED
}

export { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB, searchProductsFromDB };
