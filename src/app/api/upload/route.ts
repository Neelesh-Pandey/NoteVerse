import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";


export async function GET() {
  try {
    // Fetch all notes with user details
    const notes = await db.note.findMany({
      include: {
        user: {
          select: {
            name: true, 
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}




export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, imageUrl, pdfUrl, category, isPublic } = await req.json();
    const visibility = isPublic ? "PUBLIC" : "PRIVATE";

    if (!title || !description || !imageUrl || !pdfUrl || !category ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Fetch user from the database
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the note in the database
    const note = await db.note.create({
      data: {
        title,
        description,
        imageUrl,
        pdfUrl,
        category,
        visibility,
        userId: user.id, // Link note to user
      },
    });

    return NextResponse.json({ message: "Note created successfully", note });
  } catch (error) {
    console.error("UPLOAD ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
