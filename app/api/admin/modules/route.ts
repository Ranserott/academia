import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      include: {
        blocks: { orderBy: { order: "asc" } },
        _count: { select: { blocks: true } },
      },
    });

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("List modules error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId, title, description, order } = body;

    if (!courseId || !title) {
      return NextResponse.json(
        { error: "courseId and title required" },
        { status: 400 },
      );
    }

    const maxOrder = await prisma.module.aggregate({
      where: { courseId },
      _max: { order: true },
    });

    const module = await prisma.module.create({
      data: {
        courseId,
        title,
        description: description ?? null,
        order: typeof order === "number" ? order : (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ module });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}