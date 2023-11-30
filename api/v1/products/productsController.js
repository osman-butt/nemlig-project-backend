import { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB, searchProductsFromDB } from "./productsModel.js";

async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
 

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const products = await getProductsFromDB(category, sort, label);

  const paginatedProducts = products.slice(startIndex, endIndex);

  // HAR VALGT AT BRUGE MATH.CEIL SÅ VI SIKRER OS AT FÅ ALT DATA MED.
  const totalPages = Math.ceil(products.length / limit);

  const paginationInfo = {
    data: paginatedProducts,
    meta: {
    pagination: {
      current_page: page,
      last_page: totalPages,
      per_page: limit,
      total: products.length,
  }
  }
  }

  res.json(paginationInfo);
}

async function getProductById(req, res) {
  const productId = parseInt(req.params.id);
  const product = await getProductByIdFromDB(productId);
  res.json(product);
}

async function postProducts(req, res) {
  const productData = req.body;
  const newProduct = await postProductsInDB(productData);
  console.log(`Posted product: ${JSON.stringify(newProduct)}`);
  res.json(newProduct);
}

async function updateProduct(req, res) {
  const productId = parseInt(req.params.id);
  const productData = req.body;
  const updatedProduct = await updateProductInDB(productId, productData);
  console.log(`Updated product with id ${productId}`);
  res.json(updatedProduct);
}

async function deleteProduct(req, res) {
  const productId = parseInt(req.params.id);
  await deleteProductFromDB(productId);
  res.json({ msg: `Product with id ${productId} deleted` });
}

async function searchProducts(req, res) {
  const search = req.query.search;
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
  const sortPrice = req.query.sortPrice;
  const results = await searchProductsFromDB(search, category, sort, label, sortPrice);
  // DENNE KAN UDELADES - DETTE ER BARE SÅ VI FÅR SAMME STRUKTUR SOM VED GET REQUEST MEN UDEN META ARRAY
  const products = {
    data: results,
  }
  res.json(products);
}

export default { getProducts, getProductById, postProducts, deleteProduct, updateProduct, searchProducts };
