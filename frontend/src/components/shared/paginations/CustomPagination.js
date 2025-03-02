import React from "react";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5; // Maximum visible page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add dots after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add dots before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="ltn__pagination-area text-center">
      <div className="ltn__pagination">
        <ul>
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              style={{
                visibility: currentPage > 1 ? "visible" : "hidden",
              }}
              className="border-0 bg-transparent"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
          </li>

          {getVisiblePages().map((page, idx) => (
            <li
              key={idx}
              className={`${page === currentPage ? "pagination--active" : ""}`}
            >
              {page === "..." ? (
                <span>{page}</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`border-0 bg-transparent`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              style={{
                visibility: currentPage < totalPages ? "visible" : "hidden",
              }}
              className="border-0 bg-transparent"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomPagination;
