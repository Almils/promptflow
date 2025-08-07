// src/app/api/community/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        comments: { include: { author: true } },
        upvotedBy: true,
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Fetch post error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
