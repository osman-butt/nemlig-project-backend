import {getProductsFromDB, getProductByIdFromDB, postProductsInDB, postPriceInDB, deleteProductFromDB} from './productsModel.js';

async function getProducts(req, res){
    const products = await getProductsFromDB();
    res.json(products);
}

async function getProductById(req, res){
    const productId = parseInt(req.params.id);
    const product = await getProductByIdFromDB(productId);
    res.json(product);
}

async function postProducts(req, res){
    const productData = req.body;
    const newProduct = await postProductsInDB(productData);
    const newPrice = await postPriceInDB(productData, newProduct.product_id);
    console.log(`Posted product: ${JSON.stringify(newProduct)}`)
    res.json({ newProduct, newPrice });
}

async function deleteProduct(req, res){
    const productId = parseInt(req.params.id);
    await deleteProductFromDB(productId);
    res.json({msg: `Product with id ${productId} deleted`});
}

export default {getProducts, getProductById, postProducts, deleteProduct}