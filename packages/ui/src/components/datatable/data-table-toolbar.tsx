"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { DataTableViewOptions } from "@workspace/ui/components/datatable/datatable-column-trigger";
import { DataTableFacetedFilter } from "@workspace/ui/components/datatable/datatable-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder={searchPlaceholder}
          value={
            (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}

        {filters.map(
          (filter) =>
            table?.getColumn(filter.filterKey) && (
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
            onClick={() => table.resetColumnFilters()}
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