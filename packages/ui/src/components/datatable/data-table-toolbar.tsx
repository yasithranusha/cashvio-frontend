"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { DataTableViewOptions } from "@workspace/ui/components/datatable/datatable-column-trigger";
import { DataTableFacetedFilter } from "@workspace/ui/components/datatable/datatable-filter";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string | string[];
  searchPlaceholder?: string;
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

export function DataTableToolbar<TData>({
  table,
  searchColumn = "title",
  searchPlaceholder = "Filter tasks...",
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchValue, setSearchValue] = useState("");

  // Handle searching across multiple columns
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (Array.isArray(searchColumn)) {
      // Clear previous search filters
      searchColumn.forEach((column) => {
        if (column && table.getColumn(column)) {
          table.getColumn(column)?.setFilterValue("");
        }
      });

      // Set new search filter on first column (to show filter indicator)
      if (searchColumn.length > 0 && searchColumn[0] && table.getColumn(searchColumn[0])) {
        table.getColumn(searchColumn[0])?.setFilterValue(value);
      }

      // Apply global filter for all specified columns
      table.setGlobalFilter(value);
    } else if (searchColumn && table.getColumn(searchColumn)) {
      // Legacy single column search
      table.getColumn(searchColumn)?.setFilterValue(value);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearch}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filters.map(
          (filter) =>
            filter.filterKey && table.getColumn(filter.filterKey) && (
              <DataTableFacetedFilter
                key={filter.filterKey}
                column={table.getColumn(filter.filterKey)}
                title={filter.title}
                options={filter.options}
              />
            )
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
              setSearchValue("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}