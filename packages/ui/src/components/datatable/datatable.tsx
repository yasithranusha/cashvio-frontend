"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { DataTablePagination } from "@workspace/ui/components/datatable/datatable-pagination";
import { DataTableToolbar } from "@workspace/ui/components/datatable/data-table-toolbar";

const multiSelectFilter: FilterFn<any> = (row, columnId, filterValues) => {
  // When no values are selected, show all rows
  if (!Array.isArray(filterValues) || filterValues.length === 0) return true;

  const value = row.getValue(columnId);
  // Check if the row's value is included in the selected filter values
  return filterValues.includes(value);
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string | string[];
  searchPlaceholder?: string;
  seperateFilters?: boolean;
  filters?: Array<{
    title: string;
    filterKey: string;
    options: Array<{
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  }>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn = "title",
  searchPlaceholder = "Search",
  seperateFilters = false,
  filters = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  // Replace the customGlobalFilterFn with this simpler version:

  const customGlobalFilterFn: FilterFn<any> = React.useCallback(
    (row, columnId, filterValue) => {
      // Skip filtering if no filter value
      if (!filterValue || typeof filterValue !== "string") return true;

      const filterValueLower = filterValue.toLowerCase();

      // Search across multiple columns if provided
      if (Array.isArray(searchColumn)) {
        // Try to find a match in any of the specified columns
        for (const colId of searchColumn) {
          try {
            // Try to safely get the value
            const value = row.getValue(colId);

            // If value exists and contains the search string, return true
            if (
              value != null &&
              String(value).toLowerCase().includes(filterValueLower)
            ) {
              return true;
            }
          } catch (e) {
            // Skip if column doesn't exist
            continue;
          }
        }
        // No match found in any column
        return false;
      }
      // Search in a single column
      else if (typeof searchColumn === "string") {
        try {
          const value = row.getValue(searchColumn);
          return (
            value != null &&
            String(value).toLowerCase().includes(filterValueLower)
          );
        } catch (e) {
          return false;
        }
      }

      // If no searchColumn is specified, fall back to the column being filtered
      try {
        const value = row.getValue(columnId);
        return (
          value != null &&
          String(value).toLowerCase().includes(filterValueLower)
        );
      } catch (e) {
        return false;
      }
    },
    [searchColumn]
  );

  // Register custom filter function for filter keys
  const tableColumns = React.useMemo(() => {
    return columns.map((column) => {
      // Check if this column has a multi-select filter
      const hasMultiSelectFilter = filters.some((filter) => {
        // Safely access potential column identifiers
        const columnKey =
          "accessorKey" in column ? column.accessorKey : column.id;
        return filter.filterKey === columnKey;
      });

      if (hasMultiSelectFilter) {
        return {
          ...column,
          filterFn: multiSelectFilter,
        };
      }

      return column;
    });
  }, [columns, filters]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

return (
  <div className="space-y-4 w-full max-w-[calc(100vw-2rem)]">
    <DataTableToolbar
      seperateFilters={seperateFilters}
      table={table}
      searchColumn={searchColumn}
      searchPlaceholder={searchPlaceholder}
      filters={filters}
    />
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <DataTablePagination table={table} />
  </div>
);
}
