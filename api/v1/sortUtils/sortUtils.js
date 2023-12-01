function sortProducts(products, sort){
    if (sort === "asc") {
        return products.sort((a,b) => a.product_name.localeCompare(b.product_name));
    } else if (sort === "high-low" || sort === "low-high") {
        return products.sort((a,b) => {
            if (a.prices.length > 0 && b.prices.length > 0) {
                if (sort === 'high-low') {
                    return b.prices[0].price - a.prices[0].price;
                } else {
                    return a.prices[0].price - b.prices[0].price;
                }
            } else {
                return 0;
            }
        });
    } else {
        return products;
    }
}

export {sortProducts}