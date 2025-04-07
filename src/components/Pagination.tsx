import React from "react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
}) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white rounded-lg shadow"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="h-8 px-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700">entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
        >
          Previous
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="sm:hidden text-sm">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Pagination;
