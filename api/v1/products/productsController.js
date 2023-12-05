import { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB, searchProductsFromDB } from "./productsModel.js";
import { paginate } from "../sortUtils/paginationUtil.js";

async function getProducts(req, res) {
  try {
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
  const userEmail = req.user_email;

  const products = await getProductsFromDB(category, sort, label, userEmail);

  const paginationInfo = paginate(products, req)
  res.json(paginationInfo);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to get products" });
}
}

async function getAuthenticatedProducts(req, res) {
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
  const userEmail = req.user_email;

  const products = await getProductsFromDB(category, sort, label, userEmail);

  const paginationInfo = paginate(products, req)
  res.json(paginationInfo);
}


async function getProductById(req, res) {
  try {
  const productId = parseInt(req.params.id);
  const product = await getProductByIdFromDB(productId);
  res.json(product);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to get product by ID" });
}
}

async function postProducts(req, res) {
  try {
  const productData = req.body;
  const newProduct = await postProductsInDB(productData);
  console.log(`Posted product: ${JSON.stringify(newProduct)}`);
  res.json(newProduct);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to post product" });
}
}

async function updateProduct(req, res) {
  try {
  const productId = parseInt(req.params.id);
  const productData = req.body;
  const updatedProduct = await updateProductInDB(productId, productData);
  console.log(`Updated product with ${updatedProduct}`);
  res.json({ msg: `Product with id ${productId} updated`});
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to update product" });
}
}

async function deleteProduct(req, res) {
  try {
  const productId = parseInt(req.params.id);
  await deleteProductFromDB(productId);
  res.json({ msg: `Product with id ${productId} deleted` });
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to delete product" });
}
}

async function searchProducts(req, res) {
  try {
  const search = req.query.search;
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
  const userEmail = req.user_email;
  const results = await searchProductsFromDB(search, category, sort, label, userEmail);

  const paginatedResults = paginate(results, req)
  res.json(paginatedResults);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to get products" });
}
}

async function searchAuthenticatedProducts(req, res){
  try {
    const search = req.query.search;
    const category = req.query.category;
    const sort = req.query.sort;
    const label = req.query.label;
    const userEmail = req.user_email;
    const results = await searchProductsFromDB(search, category, sort, label, userEmail);

    const paginatedResults = paginate(results, req)
    res.json(paginatedResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get products" });
  }
}

export default { getProducts, getAuthenticatedProducts, getProductById, postProducts, deleteProduct, updateProduct, searchProducts, searchAuthenticatedProducts };
