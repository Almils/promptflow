// src/app/api/ai/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("🔑 Session:", session); // ✅ Debug session

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, conversationId } = await req.json();
    console.log("📝 Prompt:", prompt);

    // 🔹 Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      }),
    });

    console.log("🌐 OpenRouter Status:", response.status);

    const data = await response.json();
    console.log("🤖 OpenRouter Response:", data);

    if (!data.choices || !data.choices[0].message) {
      throw new Error("No AI response from OpenRouter");
    }
    const aiResponse = data.choices[0].message.content;

    let conversation = null;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }
    if (!conversation) {
      // Create conversation without title
conversation = await prisma.conversation.create({
  data: {
    user: { connect: { email: session.user.email } },
  },
});

    }

    await prisma.message.createMany({
      data: [
        { content: prompt, role: "user", conversationId: conversation.id },
        { content: aiResponse, role: "assistant", conversationId: conversation.id },
      ],
    });

    return NextResponse.json({ 
      response: aiResponse, 
      conversationId: conversation.id 
    });
  } catch (error) {
    console.error("🔥 AI API Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate response", 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
