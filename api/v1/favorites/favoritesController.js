import { getFavoritesFromDB, getFavoriteByIdFromDB, postFavoriteInDB, deleteFavoriteFromDB, searchFavoritesFromDB } from "./favoritesModel.js";

async function getFavorites(req, res) {
  try {
  const sort = req.query.sort;
  const label = req.query.label;
  const category = req.query.category;
  const favorites = await getFavoritesFromDB(sort, label, category);

  const response = {
    data: favorites,
    meta: {
      total: favorites.length,
    },
  };
  res.json(response);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to get favorites" });
}
}

async function getFavoriteById(req, res) {
  try {
  const productId = parseInt(req.params.id);
  const favorite = await getFavoriteByIdFromDB(productId);
  res.json(favorite);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to get favorite by ID" });
}
}

async function postFavorite(req, res) {
  try {
  const productId = req.body.product_id;
  const customerId = req.body.customer_id;
    const favorite = await postFavoriteInDB(productId, customerId);
    console.log(`New favorite: ${JSON.stringify(favorite)}`);
    res.json(favorite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to post favorite"});
  }
}

async function deleteFavorite(req, res) {
  try {
  const favoriteId = parseInt(req.params.id);
  await deleteFavoriteFromDB(favoriteId);
  console.log(`Deleted favorite with ID: ${favoriteId}`);
  res.json({ msg: `Product removed from favorites` });
}
catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to delete favorite" });
}
}

async function searchFavorites(req, res) {
  try {
  const search = req.query.search;
  const sort = req.query.sort;
  const label = req.query.label;
  const category = req.query.category;
  const results = await searchFavoritesFromDB(search, sort, label, category);
  const response = {
    data: results,
  }
  res.json(response);
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Failed to search favorites" });
}
}

export default { getFavorites, getFavoriteById, postFavorite, deleteFavorite, searchFavorites };
