function sortProducts(products, sort){
    if (sort === "asc") {
        return products.sort((a,b) => a.product_name.localeCompare(b.product_name));
    } else if (sort === "high-low" || sort === "low-high") {
        return products.sort((a,b) => {
            if (a.prices.length > 0 && b.prices.length > 0) {
                const minPriceA = Math.min(...a.prices.map(price => price.price));
                const minPriceB = Math.min(...b.prices.map(price => price.price));
                if (sort === 'high-low') {
                    return minPriceB - minPriceA;
                } else {
                    return minPriceA - minPriceB;
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