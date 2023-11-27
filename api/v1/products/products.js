import express from "express";
import {PrismaClient} from "@prisma/client";

const productsRouter = express.Router();
const prisma = new PrismaClient();

// GET PRODUCTS
async function getProducts(){
    const products = await prisma.product.findMany({
        include: {
            labels: true,
            categories: true,
            inventory: true,
           // HVOR FÅR VI DENNE FRA images: true,
            prices: true
        }
    });
    return products;
}

// POST PRODUCT
async function postProducts(productData){
    const newProduct = await prisma.product.create({
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
                    is_campaign: productData.is_campaign,
                    starting_at: new Date(productData.starting_at).toISOString(),
                    ending_at: new Date(productData.ending_at).toISOString(),
                }
            },
        },
    });
    return newProduct;
}

// DELETE PRODUCT
async function deleteProduct(productId) {
// DELETE RELATIONS ON JUNCTION TABLES - USING RAW SQL, AS WE CANT ADD CASCADING DELETES ON MANY-TO-MANY IMPLICIT RELATION TABLES
await prisma.$queryRaw`DELETE FROM _CategoryToProduct WHERE B = ${productId};`;
await prisma.$queryRaw`DELETE FROM _LabelToProduct WHERE B = ${productId};`;
await prisma.$queryRaw`DELETE FROM Inventory WHERE product_id = ${productId};`;
await prisma.$queryRaw`DELETE FROM Price WHERE product_id = ${productId};`;

// DELETE PRODUCT
await prisma.product.delete({ where: { product_id: productId }});
}

productsRouter.get("/", async (req, res) => {
const products = await getProducts();
res.json(products);
})

productsRouter.post("/", async (req, res) => {
    const productData = req.body;
    const newProduct = await postProducts(productData);
    res.json(newProduct);
});

productsRouter.delete("/:id", async (req, res) => {
    const productId = parseInt(req.params.id);
    const deletedProduct = await deleteProduct(productId);
    res.json(deletedProduct);
});


export { productsRouter };
