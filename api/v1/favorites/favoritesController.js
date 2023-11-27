import { getFavoritesFromDB } from "./favoritesModel.js";

async function getFavorites(req, res) {
  const favorites = await getFavoritesFromDB();
  res.json(favorites);
}

export default { getFavorites };
