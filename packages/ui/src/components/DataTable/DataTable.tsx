/**
 * Comprehensive DataTable Component
 * Features: Sorting, Filtering, Pagination, Selection
 * Senior UI/UX Engineer - Component Specialist
 */

import React, { useState, useMemo, useCallback } from 'react';
import './DataTable.css';
import { Button } from '../Button';
import { Input } from '../Input';
import { Spinner } from '../Spinner';

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  showSelection?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
  stickyHeader?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  pageSize = 10,
  showPagination = true,
  showSearch = true,
  showSelection = false,
  onRowClick,
  onSelectionChange,
  className = '',
  stickyHeader = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Get unique identifier for rows
  const getRowId = useCallback((row: T, index: number): string => {
    return (row as any).id?.toString() || `row-${index}`;
  }, []);

  // Filter data based on search and column filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search query
    if (searchQuery.trim()) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        result = result.filter((row) => {
          const cellValue = row[key]?.toString().toLowerCase() || '';
          return cellValue.includes(value.toLowerCase());
        });
      }
    });

    return result;
  }, [data, searchQuery, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection((prev) => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
      if (sortDirection === 'desc') {
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection, columns]);

  // Handle selection
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((row, idx) => getRowId(row, idx)));
      setSelectedRows(allIds);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  }, [paginatedData, getRowId, onSelectionChange]);

  const handleSelectRow = useCallback((row: T, index: number, checked: boolean) => {
    const rowId = getRowId(row, index);
    const newSelected = new Set(selectedRows);

    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }

    setSelectedRows(newSelected);
    const selectedData = data.filter((r, idx) => newSelected.has(getRowId(r, idx)));
    onSelectionChange?.(selectedData);
  }, [selectedRows, data, getRowId, onSelectionChange]);

  // Handle filter change
  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1);
  }, []);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  if (loading) {
    return (
      <div className="data-table data-table--loading">
        <div className="data-table__loading">
          <Spinner />
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`.trim()}>
      {/* Search and Filters */}
      {(showSearch || columns.some((col) => col.filterable)) && (
        <div className="data-table__toolbar">
          {showSearch && (
            <div className="data-table__search">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {columns.some((col) => col.filterable) && (
            <div className="data-table__filters">
              {columns
                .filter((col) => col.filterable)
                .map((col) => (
                  <Input
                    key={col.key}
                    type="text"
                    placeholder={`Filter ${col.label}...`}
                    value={filters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  />
                ))}
            </div>
          )}

          {(searchQuery || Object.values(filters).some((v) => v.trim())) && (
            <Button variant="secondary" size="small" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="data-table__container">
        <table className={`data-table__table ${stickyHeader ? 'data-table__table--sticky' : ''}`}>
          <thead>
            <tr>
              {showSelection && (
                <th className="data-table__header data-table__header--select">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every((row, idx) => selectedRows.has(getRowId(row, idx)))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`data-table__header ${column.sortable ? 'data-table__header--sortable' : ''} ${column.align ? `data-table__header--${column.align}` : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="data-table__header-content">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="data-table__sort-indicator">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showSelection ? 1 : 0)}
                  className="data-table__empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = getRowId(row, rowIndex);
                const isSelected = selectedRows.has(rowId);
                const actualIndex = (currentPage - 1) * pageSize + rowIndex;

                return (
                  <tr
                    key={rowId}
                    className={`data-table__row ${isSelected ? 'data-table__row--selected' : ''} ${onRowClick ? 'data-table__row--clickable' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {showSelection && (
                      <td className="data-table__cell data-table__cell--select">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row, actualIndex, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${actualIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`data-table__cell ${column.align ? `data-table__cell--${column.align}` : ''}`}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="data-table__pagination">
          <div className="data-table__pagination-info">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="data-table__pagination-controls">
            <Button
              variant="secondary"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <div className="data-table__pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and adjacent pages
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, idx, arr) => {
                  // Add ellipsis if there's a gap
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="data-table__pagination-ellipsis">...</span>}
                      <Button
                        variant={currentPage === page ? 'primary' : 'secondary'}
                        size="small"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>
            <Button
              variant="secondary"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

