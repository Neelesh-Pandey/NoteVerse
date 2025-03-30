"use client";

import { ColumnDef, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import Link from "next/link";

// ✅ Define Note type
export type Note = {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  createdAt: string;
};

// ✅ Define Props
interface DataTableProps {
  data: Note[];
  onDelete: (id: string) => void;
}

export default function DataTable({ data, onDelete }: DataTableProps) {
  // ✅ Table Columns
  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: "createdAt",
      header: "Uploaded On",
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const note = row.original;
        return (
          <div className="flex space-x-2">
            <Link href={note.pdfUrl} target="_blank">
              <Button variant="outline">View</Button>
            </Link>

            <Link href={`/update/${note.id}`}>
              <Button variant="secondary">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => onDelete(note.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // ✅ React Table Instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                No notes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 📄 Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
