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
return await prisma.product.create({
    data: {
        product_name: productData.product_name,
        product_underline: productData.product_underline,
        product_description: productData.product_description,
        labels: {
            // DETTE ANTAGER AT LABELS HAR ET MANGE-TIL-MANGE FORHOLD TIL PRODUKTER
            connect: productData.labels.map(label => ({ label_id: label })),
        },
        categories: {
            // DETTE ANTAGER AT KATEGORIER HAR ET MANGE-TIL-MANGE FORHOLD TIL PRODUKTER
            connect: productData.categories.map(category => ({ category_id: category })),
        },
        inventory: {
            create: {
                inventory_stock: productData.inventory_stock,
            }
        },
        prices: {
            create: {
                price: productData.price,
                starting_at: new Date(productData.starting_at).toISOString(),
                is_campaign: productData.is_campaign,
                ending_at: new Date(productData.ending_at).toISOString(),
            }
        }
    }
});
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

export {getProductsFromDB, getProductByIdFromDB, postProductsInDB, deleteProductFromDB}