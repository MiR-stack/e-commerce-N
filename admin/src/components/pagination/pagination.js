import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const visiblePages = 5;

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + visiblePages - 1);

      if (end === totalPages) {
        start = totalPages - visiblePages + 1;
      }

      for (let i = start; i <= end; i += 1) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev className="shadow" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <CsLineIcons icon="chevron-left" />
      </Pagination.Prev>

      {getPageNumbers().map((page) => (
        <Pagination.Item className="shadow" key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
          {page}
        </Pagination.Item>
      ))}

      <Pagination.Next className="shadow" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <CsLineIcons icon="chevron-right" />
      </Pagination.Next>
    </Pagination>
  );
};

export default CustomPagination;
