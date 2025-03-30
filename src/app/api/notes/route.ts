import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ✅ Adjust this path based on your DB setup
import { Prisma } from "@prisma/client";

// GET - Fetch Notes with Search and Sort
export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("search") || "";
  const sortBy = url.searchParams.get("sort") || "recent";
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10; // Number of notes per page

  try {
    // ✅ Build Where Condition for Search
    const whereCondition: Prisma.NoteWhereInput = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    // ✅ Correct Sort Order
    const orderBy =
      sortBy === "popular"
        ? { upvotes: "desc" as Prisma.SortOrder }
        : sortBy === "oldest"
        ? { createdAt: "asc" as Prisma.SortOrder }
        : { createdAt: "desc" as Prisma.SortOrder };

    // ✅ Fetch Notes with Pagination
    const notes = await db.note.findMany({
      where: whereCondition,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: true },
    });

    // ✅ Check if there are more notes available
    const totalNotes = await db.note.count({ where: whereCondition });
    const hasMore = page * pageSize < totalNotes;

    return NextResponse.json({ notes, hasMore });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Error fetching notes" },
      { status: 500 }
    );
  }
}
