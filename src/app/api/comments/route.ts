// /src/app/api/comments/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, userId: dbUserId, noteId, parentId } = await req.json();

    if (!content || !dbUserId || !noteId) {
      return NextResponse.json(
        { error: "Content, userId, and noteId are required" },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await db.comment.create({
      data: {
        content,
        userId: dbUserId,
        noteId,
        parentId,
      },
      include: {
        user: true, // Include the user data in the response
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[COMMENTS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const noteId = url.searchParams.get("noteId");

  if (!noteId) {
    return NextResponse.json(
      { error: "Note ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get all top-level comments for the note
    const comments = await db.comment.findMany({
      where: {
        noteId,
        parentId: null, // Only get top-level comments
      },
      include: {
        user: true,
        // Use recursive include to get all levels of nested comments
        children: {
          include: {
            user: true,
            children: {
              include: {
                user: true,
                children: {
                  include: {
                    user: true,
                    children: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recent comments first
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}