import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { moduleId, type, title, body: content, order } = body;

    if (!moduleId || !type || !content) {
      return NextResponse.json(
        { error: "moduleId, type and body required" },
        { status: 400 },
      );
    }

    if (type !== "text" && type !== "video") {
      return NextResponse.json(
        { error: "type must be 'text' or 'video'" },
        { status: 400 },
      );
    }

    const maxOrder = await prisma.contentBlock.aggregate({
      where: { moduleId },
      _max: { order: true },
    });

    const block = await prisma.contentBlock.create({
      data: {
        moduleId,
        type,
        title: title ?? null,
        body: content,
        order: typeof order === "number" ? order : (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ block });
  } catch (error) {
    console.error("Create block error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}