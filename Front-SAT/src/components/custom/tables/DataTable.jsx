"use client";
import { Input } from "@/components/shadcn/input";
import { CircleCheckBig } from 'lucide-react';
import { CircleX } from 'lucide-react';
import * as React from "react";
import {
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

export function DataTable({ columns, data, filtro }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [selectedRowId, setSelectedRowId] = React.useState(null); // Estado para la fila seleccionada

  if (!columns || !data) {
    return <div className="text-red-500">Las columnas o los datos están faltando.</div>;
  }
  const filteredColumns = columns.filter(column => column.meta?.visible !== false);
  // Convertir los valores de la columna de filtro a string
  const processedData = React.useMemo(() => {
    return data.map(row => ({
      ...row,
      [filtro]: String(row[filtro]), // Convertir el valor de la columna `filtro` a string
    }));
  }, [data, filtro]);

  // Configuración de la tabla
  const table = useReactTable({
    data: processedData,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  // Obteniendo la columna para el filtro basado en el prop `filtro`
  const filterColumn = table.getColumn(filtro);

  // Manejar el clic en una fila
  const handleRowClick = (rowId) => {
    setSelectedRowId(rowId); // Actualiza el estado con el ID de la fila clicada
  };

  return (
    <div className="">
      <div className="flex items-center py-4">
        {/* Campo de entrada para filtrar basado en el `filtro` pasado */}
        {filterColumn && (
          <Input
            placeholder={`Buscar por ${filtro}...`}
            value={filterColumn.getFilterValue() ?? ""}
            onChange={(event) =>
              filterColumn.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
      </div>
      <div className="flex flex-col h-auto max-h-[calc(100vh-4rem)] w-full rounded-md border shadow-2xl overflow-hidden">
        <Table className="flex-1 overflow-y-auto">
          <TableHeader className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-white text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  data-state={selectedRowId === row.id ? "selected" : undefined}
                  className={`cursor-pointer ${selectedRowId === row.id ? "bg-blue-200" : ""} text-center`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue();
                    const isAprobadoColumn = cell.column.id === 'aprobado';
                    const displayValue = isAprobadoColumn
                      ? cellValue === true
                        ? <CircleCheckBig className="text-green-500 ml-16" />
                        : cellValue === false
                          ? <CircleX className="text-red-500 ml-16" />
                          : ''
                      : flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );

                    return (
                      <TableCell key={cell.id}>
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getHeaderGroups().flatMap(group => group.headers).length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>

  );
}
