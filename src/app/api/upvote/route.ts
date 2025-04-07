// /app/api/upvote/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { noteId } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!noteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    // Check if user has already upvoted
    const existingUpvote = await db.upvote.findUnique({
      where: {
        noteId_userId: {
          noteId,
          userId,
        },
      },
    });

    let updatedNote;

    if (existingUpvote) {
      // Remove upvote if already upvoted
      await db.upvote.delete({
        where: { id: existingUpvote.id },
      });

      updatedNote = await db.note.update({
        where: { id: noteId },
        data: {
          upvotes: { decrement: 1 },
        },
      });

      return NextResponse.json({ success: true, upvotes: updatedNote.upvotes, isUpvoted: false });
    } else {
      // Add new upvote
      await db.upvote.create({
        data: {
          noteId,
          userId,
        },
      });

      updatedNote = await db.note.update({
        where: { id: noteId },
        data: {
          upvotes: { increment: 1 },
        },
      });

      return NextResponse.json({ success: true, upvotes: updatedNote.upvotes, isUpvoted: true });
    }
  } catch (error) {
    console.error("[UPVOTE ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}