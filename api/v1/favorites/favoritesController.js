import { getFavoritesFromDB, getFavoriteByIdFromDB } from "./favoritesModel.js";

async function getFavorites(req, res) {
  const favorites = await getFavoritesFromDB();
  res.json(favorites);
}

async function getFavoriteById(req, res) {
  const productId = parseInt(req.params.id);
  const favorite = await getFavoriteByIdFromDB(productId);
  res.json(favorite);
}

export default { getFavorites, getFavoriteById };
