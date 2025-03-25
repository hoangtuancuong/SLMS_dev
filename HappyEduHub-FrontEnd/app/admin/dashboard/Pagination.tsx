
// components/Pagination.js
import React from 'react';
import { Button } from 'flowbite-react';

const Pagination = ({ currentPage, totalPages, onNext, onPrev, onGoToPage }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button onClick={onPrev} disabled={currentPage === 1}>
        Trang trước
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          onClick={() => onGoToPage(number)}
          className={`px-4 py-2 ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {number}
        </Button>
      ))}
      <Button onClick={onNext} disabled={currentPage === totalPages}>
        Trang sau
      </Button>
    </div>
  );
};

export default Pagination;
