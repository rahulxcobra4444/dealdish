const paginate = (query, page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    skip,
    limit: limitNum,
    page: pageNum
  };
};

const paginateResponse = (data, page, limit, total) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  return {
    data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1
    }
  };
};

module.exports = { paginate, paginateResponse };