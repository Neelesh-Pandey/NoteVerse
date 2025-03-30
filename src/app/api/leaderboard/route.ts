import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Fetch leaderboard based on type (upvoted/contributors)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  let leaderboard;

  if (type === "contributors") {
    leaderboard = await db.user.findMany({
      where: {
        notes: {
          some: {}, // ✅ Exclude users with 0 notes
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        _count: {
          select: { notes: true }, // Count number of notes
        },
      },
      orderBy: {
        notes: {
          _count: "desc", // Order by number of notes
        },
      },
      take: 10,
    });

    // ✅ Correctly map to include total_notes
    leaderboard = leaderboard.map((user) => ({
      ...user,
      total_notes: user._count.notes,
    }));
  } else {
    // ✅ Fetch top upvoted profiles
    leaderboard = await db.user.findMany({
        where: {
          notes: {
            some: {
              upvotes: {
                gt: 0, // ✅ Only include users with notes that have >0 upvotes
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          notes: {
            select: {
              upvotes: true,
            },
          },
        },
      });
      

    // ✅ Map to calculate total_upvotes per user
    leaderboard = leaderboard
      .map((user) => ({
        ...user,
        total_upvotes: user.notes.reduce((sum, note) => sum + note.upvotes, 0),
      }))
      .sort((a, b) => b.total_upvotes - a.total_upvotes)
      .slice(0, 10);
  }

  return NextResponse.json(leaderboard);
}
