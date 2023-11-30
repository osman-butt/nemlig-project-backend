import { getFavoritesFromDB, getFavoriteByIdFromDB, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB } from "./favoritesModel.js";

async function getFavorites(req, res) {
  const sort = req.query.sort;
  const label = req.query.label;
  const favorites = await getFavoritesFromDB(sort, label);
  res.json(favorites);
}

async function getFavoriteById(req, res) {
  const productId = parseInt(req.params.id);
  const favorite = await getFavoriteByIdFromDB(productId);
  res.json(favorite);
}

async function postFavorite(req, res) {
  const productId = req.body.product_id;
  const customerId = req.body.customer_id;
  try {
    const favorite = await postFavoriteInDB(productId, customerId);
    console.log(`New favorite: ${JSON.stringify(favorite)}`);
    res.status(201).json(favorite);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function deleteFavorite(req, res) {
  const productId = req.body.product_id;
  const customerId = req.body.customer_id;
  try {
    await deleteFavoriteFromDB(productId, customerId);
    console.log(`Deleted favorite with product ID: ${productId}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function searchFavorites(req, res) {
  const search = req.query.search;
  const sort = req.query.sort;
  const label = req.query.label;
  const favorites = await searchFavoritesFromDB(search, sort, label);
  res.json(favorites);
}

export default { getFavorites, getFavoriteById, postFavorite, deleteFavorite, searchFavorites };
