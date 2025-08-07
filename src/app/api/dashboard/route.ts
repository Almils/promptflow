// src/app/api/dashboard/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.warn("No session found for dashboard request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        prompts: true,
        communityPosts: {
          include: {
            comments: true,
            upvotedBy: true,
          },
        },
      },
    });

    if (!user) {
      console.error("User not found:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalUpvotes = user.communityPosts.reduce(
      (sum, post) => sum + post.upvotes,
      0
    );
    const totalComments = user.communityPosts.reduce(
      (sum, post) => sum + post.comments.length,
      0
    );

    return NextResponse.json({
      name: user.name,
      points: user.points,
      promptsCreated: user.prompts.length,
      communityPosts: user.communityPosts.length,
      totalUpvotes,
      totalComments,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
