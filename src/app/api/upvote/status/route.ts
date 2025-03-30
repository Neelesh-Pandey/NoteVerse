import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ isUpvoted: false });
    }

    const upvote = await db.upvote.findUnique({
      where: {
        noteId_userId: {
          noteId: noteId!,
          userId,
        },
      },
    });

    return NextResponse.json({ isUpvoted: !!upvote });
  } catch (error) {
    console.error("Error checking upvote status:", error);
    return NextResponse.json({ isUpvoted: false });
  }
}
