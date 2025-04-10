import { type ReactNode, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import type { Pagination } from "../../types/models";
import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  actions?: (item: T) => ReactNode;
}

const DataTable = <T extends object>({
  columns,
  data,
  keyField,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  emptyState,
  actions,
}: DataTableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const toggleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...data]);
    }
  };

  const toggleSelectItem = (item: T) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const renderCell = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    return row[column.accessor as keyof T];
  };

  const pageSizes = [10, 25, 50, 100];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index.toString()}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-4 text-center"
              >
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-10 text-center"
              >
                {emptyState || (
                  <div className="text-gray-500">No data available</div>
                )}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={String(row[keyField])} className="hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td
                    key={index.toString()}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                      column.className || ""
                    }`}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              type="button"
              onClick={() => onPageChange?.((pagination.page || 1) - 1)}
              disabled={!pagination.page || pagination.page <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => onPageChange?.((pagination.page || 1) + 1)}
              disabled={!pagination.next_page}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {data.length
                    ? 1 + ((pagination.page || 1) - 1) * (pagination.size || 10)
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    (pagination.page || 1) * (pagination.size || 10),
                    pagination.total || 0
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total || 0}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  onClick={() => onPageChange?.(1)}
                  disabled={!pagination.page || pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">First Page</span>
                  <FiChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange?.((pagination.page || 1) - 1)}
                  disabled={!pagination.page || pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {pagination.page || 1}
                </span>

                <button
                  type="button"
                  onClick={() => onPageChange?.((pagination.page || 1) + 1)}
                  disabled={!pagination.next_page}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const totalPages =
                      pagination.total && pagination.size
                        ? Math.ceil(pagination.total / pagination.size)
                        : 1;
                    onPageChange?.(totalPages);
                  }}
                  disabled={!pagination.next_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last Page</span>
                  <FiChevronsRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
