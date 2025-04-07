"use client";

import { useState } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender, SortingState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, ThumbsUp, Calendar, Text, ArrowUpDown } from "lucide-react";
import Link from "next/link";

// ✅ Define Note type
export type Note = {
  id: string;
  title: string;
  description: string; // Keep for compatibility
  pdfUrl: string;
  upvotes: number;
  createdAt: string;
  upvotedByUser?: boolean;
};

// ✅ Define Props interface
interface DataTableProps {
  data: Note[];
  onDelete: (id: string) => void;
  onUpvote: (id: string) => void;
}

export default function DataTable({ data, onDelete, onUpvote }: DataTableProps) {
  // ✅ Add sorting state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "upvotes", desc: true } // Default sort by upvotes descending
  ]);

  // ✅ Table Columns with optimized display
  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => {
        const title = info.getValue() as string;
        // Truncate long titles on mobile
        return <div className="max-w-[150px] md:max-w-full truncate">{title}</div>;
      },
    },
    {
      accessorKey: "upvotes",
      header: "Upvotes",
      cell: ({ row }) => {
        const note = row.original;
        return (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onUpvote(note.id);
              }}
              className={note.upvotedByUser ? "text-blue-600" : ""}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-sm">{note.upvotes || 0}</span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        // Format date more compactly
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const note = row.original;
        return (
          <div className="flex space-x-1">
            <Link href={note.pdfUrl} target="_blank">
              <Button variant="outline" size="sm" className="h-8 px-2">View</Button>
            </Link>
            
            <Link href={`/update/${note.id}`}>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(note.id)}>
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  // ✅ React Table Instance with sorting
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Show fewer items per page for better mobile view
      },
    },
  });

  return (
    <div>
      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium mt-1">Sort by:</span>
        <Button 
          variant={sorting[0]?.id === "upvotes" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSorting([{ id: "upvotes", desc: sorting[0]?.id === "upvotes" ? !sorting[0].desc : true }])}
          className="h-8"
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Upvotes
          {sorting[0]?.id === "upvotes" && (
            <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
          )}
        </Button>
        
        <Button 
          variant={sorting[0]?.id === "createdAt" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSorting([{ id: "createdAt", desc: sorting[0]?.id === "createdAt" ? !sorting[0].desc : true }])}
          className="h-8"
        >
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Date
          {sorting[0]?.id === "createdAt" && (
            <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
          )}
        </Button>
        
        <Button 
          variant={sorting[0]?.id === "title" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSorting([{ id: "title", desc: sorting[0]?.id === "title" ? !sorting[0].desc : false }])}
          className="h-8"
        >
          <Text className="h-3.5 w-3.5 mr-1" />
          Title
          {sorting[0]?.id === "title" && (
            <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
          )}
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-2 py-2">
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
                    <TableCell key={cell.id} className="px-2 py-2">
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
        <div className="flex items-center justify-between px-2 py-2 border-t">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}