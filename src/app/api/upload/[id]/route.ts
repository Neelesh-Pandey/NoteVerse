import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const note = await db.note.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          where: { parentId: null },
          include: {
            user: true,
            children: {
              include: { user: true },
            },
          },
        },
        upvotesBy: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const isUpvoted = !!(await db.upvote.findUnique({
      where: {
        noteId_userId: {
          noteId: id,
          userId,
        },
      },
    }));

    return NextResponse.json({
      ...note,
      upvotes: note.upvotesBy.length,
      isUpvoted,
    });
  } catch (error) {
    return NextResponse.json({ "[GET]": error }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.note.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ "[DELETE]": error }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, imageUrl, pdfUrl } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const updatedNote = await db.note.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title,
        description,
        imageUrl,
        pdfUrl,
      },
    });

    return NextResponse.json(
      { message: "Note updated successfully", note: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ "[PUT]": error }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, description, pdfUrl } = await req.json();
    if (!title || !description || !pdfUrl) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedNote = await db.note.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title,
        description,
        pdfUrl,
      },
    });

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    return NextResponse.json({ "[PATCH]": error }, { status: 500 });
  }
}
