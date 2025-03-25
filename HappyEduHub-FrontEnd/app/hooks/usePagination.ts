import { useState } from 'react';

const usePagination = (initialLimit = 10, totalItems = 0) => {
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);

  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setOffset(offset + limit);
    }
  };

  const prevPage = () => {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setOffset((page - 1) * limit);
    }
  };

  return {
    limit,
    offset,
    nextPage,
    prevPage,
    goToPage,
    totalPages,
    currentPage,
    setLimit,
  };
};

export default usePagination;
