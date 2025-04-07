import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth(); // Get logged-in user ID
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Fetch the user's notes including upvotes
    const notes = await db.note.findMany({
      where: { userId: user.id },
      orderBy: { 
        upvotes: "desc" // Sort by upvotes descending
      },
    });
    
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching user notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}