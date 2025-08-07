// src/app/api/leaderboard/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
      },
      orderBy: { points: "desc" },
      take: 20,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
