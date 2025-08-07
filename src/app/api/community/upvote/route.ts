import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Avoid duplicate upvotes
    const alreadyUpvoted = await prisma.communityPost.findFirst({
      where: {
        id: postId,
        upvotedBy: { some: { id: user.id } },
      },
    });

    let updatedPost;
    if (alreadyUpvoted) {
      // Remove upvote (toggle behavior)
      updatedPost = await prisma.communityPost.update({
        where: { id: postId },
        data: {
          upvotes: { decrement: 1 },
          upvotedBy: { disconnect: { id: user.id } },
        },
        include: {
          author: { select: { id: true, name: true } },
          comments: { include: { author: { select: { id: true, name: true } } } },
        },
      });
    } else {
      // Add upvote
      updatedPost = await prisma.communityPost.update({
        where: { id: postId },
        data: {
          upvotes: { increment: 1 },
          upvotedBy: { connect: { id: user.id } },
        },
        include: {
          author: { select: { id: true, name: true } },
          comments: { include: { author: { select: { id: true, name: true } } } },
        },
      });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
