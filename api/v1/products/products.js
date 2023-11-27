import express from "express";
import {PrismaClient} from "@prisma/client";

const productsRouter = express.Router();
const prisma = new PrismaClient();


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

// POST PRODUCTS 
async function postProducts(productData){
    const newProduct = await prisma.product.create({
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
            },
            prices: {
                create: {
                    price: productData.price,
                    is_member: productData.is_member,
                    is_pricematch: productData.is_pricematch,
                }
            },
        },
    });
    return newProduct;
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



export { productsRouter };
