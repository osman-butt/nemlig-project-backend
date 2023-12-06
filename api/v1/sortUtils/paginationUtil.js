function paginate(array, req) {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const paginatedItems = array.slice(startIndex, endIndex);
    const totalPages = Math.ceil(array.length / limit);
  
    return {
      data: paginatedItems,
      meta: {
        pagination: {
          current_page: page,
          last_page: totalPages,
          per_page: limit,
          total: array.length,
        }
      }
    };
  }

  export { paginate };