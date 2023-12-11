export function getValidPrice(prices) {
  const currentDate = new Date();

  // Filter prices based on the date condition
  const validPrices = prices.filter(price => {
    const startingDate = new Date(price.starting_at);
    const endingDate = new Date(price.ending_at);

    return startingDate <= currentDate && currentDate <= endingDate;
  });

  // Find the minimum price among valid prices
  const minPrice = validPrices.reduce(
    (min, price) => (price.price < min ? price.price : min),
    Infinity
  );

  return minPrice;
}
