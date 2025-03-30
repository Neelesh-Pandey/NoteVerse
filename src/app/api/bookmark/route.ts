import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// ✅ Helper function to get User from Clerk User ID
async function getDatabaseUser(clerkUserId: string) {
  return await db.user.findUnique({
    where: {
      clerkUserId,
    },
  });
}

// ✅ GET - Fetch All Bookmarks for User
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    // ✅ Get user from database using Clerk user ID
    const user = await getDatabaseUser(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found in the database!" },
        { status: 404 }
      );
    }

    // ✅ Check if a specific note is bookmarked or fetch all bookmarks
    const noteId = req.nextUrl.searchParams.get("noteId");

    if (noteId) {
      // ✅ Check if the specific note is bookmarked
      const bookmark = await db.bookmark.findFirst({
        where: {
          userId: user.id,
          noteId,
        },
      });

      const isBookmarked = !!bookmark;
      return NextResponse.json({ isBookmarked }, { status: 200 });
    }

    // ✅ Fetch all bookmarks with related notes
    const bookmarks = await db.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        note: true,
      },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error("Error in /api/bookmark (GET):", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}

// ✅ POST - Add Bookmark
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    const { noteId } = await req.json();

    if (!clerkUserId || !noteId) {
      return NextResponse.json(
        { error: "Invalid request data. userId or noteId is missing!" },
        { status: 400 }
      );
    }

    // ✅ Get user from database using Clerk user ID
    const user = await getDatabaseUser(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found in the database!" },
        { status: 404 }
      );
    }

    // ✅ Check if the note exists
    const noteExists = await db.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!noteExists) {
      return NextResponse.json(
        { error: "Note not found!" },
        { status: 404 }
      );
    }

    // ✅ Check if note already bookmarked by the user
    const existingBookmark = await db.bookmark.findFirst({
      where: {
        userId: user.id,
        noteId,
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Note already bookmarked" },
        { status: 400 }
      );
    }

    // ✅ Create a new bookmark
    const bookmark = await db.bookmark.create({
      data: {
        userId: user.id,
        noteId,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error in /api/bookmark (POST):", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Remove Bookmark
export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    const { noteId } = await req.json();

    if (!clerkUserId || !noteId) {
      return NextResponse.json(
        { error: "Invalid request data. userId or noteId is missing!" },
        { status: 400 }
      );
    }

    // ✅ Get user from database using Clerk user ID
    const user = await getDatabaseUser(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found in the database!" },
        { status: 404 }
      );
    }

    // ✅ Delete the bookmark if it exists
    const deletedBookmark = await db.bookmark.deleteMany({
      where: {
        userId: user.id,
        noteId,
      },
    });

    if (deletedBookmark.count === 0) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Bookmark removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/bookmark (DELETE):", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
