import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function getProductsFromDB(){
    return await prisma.product.findMany({
        include: {
            labels: true,
            categories: true,
            inventory: true,
           // images: true,
            prices: true
        }
    });
}

async function getProductByIdFromDB(productId){
    return await prisma.product.findUnique({
        where: { product_id: productId },
        include: {
            labels: true,
            categories: true,
            inventory: true,
            //images: true,
            prices: true
        }
    });
}

async function postProductsInDB(productData){
    console.log("Posting product with data:", productData);
    const createdProduct = await prisma.product.create({
        data: {
            product_name: productData.product_name,
            product_underline: productData.product_underline,
            product_description: productData.product_description,
            labels: {
                connect: productData.labels.map(label => ({ label_id: label })),
            },
            categories: {
                connect: productData.categories.map(category => ({ category_id: category })),
            },
            inventory: {
                create: {
                    inventory_stock: productData.inventory_stock,
                }
            }
        }
    });

    console.log("Created product:", createdProduct);
    return createdProduct;
}

async function postPriceInDB(priceData, productId){
    console.log("Posting price with data:", priceData, "and product_id:", productId);
    const createdPrice = await prisma.price.create({
        data: {
            price: priceData.price,
            starting_at: new Date(priceData.starting_at).toISOString(),
            is_campaign: priceData.is_campaign,
            ending_at: new Date(priceData.ending_at).toISOString(),
            product_id: productId
        }
    });

    console.log("Created price:", createdPrice);
    return createdPrice;
}

async function deleteProductFromDB(productId){
       // DELETE RELATIONS ON JUNCTION TABLES - USING RAW SQL, AS WE CANT ADD CASCADING DELETES ON MANY-TO-MANY IMPLICIT RELATION TABLES
       await prisma.$queryRaw`DELETE FROM _CategoryToProduct WHERE B = ${productId};`;
       await prisma.$queryRaw`DELETE FROM _LabelToProduct WHERE B = ${productId};`;
       await prisma.$queryRaw`DELETE FROM Inventory WHERE product_id = ${productId};`;
       await prisma.$queryRaw`DELETE FROM Price WHERE product_id = ${productId};`;
   
       // DELETE PRODUCT
       await prisma.product.delete({ where: { product_id: productId }}); 
}

export {getProductsFromDB, getProductByIdFromDB, postProductsInDB, postPriceInDB, deleteProductFromDB}