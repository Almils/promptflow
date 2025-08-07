import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 📌 Get all prompts (private history for logged-in user)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompts = await prisma.prompt.findMany({
      where: { user: { email: session.user.email } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Fetch prompts error:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

// 📌 Save a prompt & response (used internally by Playground)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, response } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newPrompt = await prisma.prompt.create({
      data: {
        prompt,
        response,
        model: "openai/gpt-4o-mini",
        user: { connect: { id: user.id } },
      },
      include: { user: true },
    });

    return NextResponse.json(newPrompt);
  } catch (error) {
    console.error("Create prompt error:", error);
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
  }
}
