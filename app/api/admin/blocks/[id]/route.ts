import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.title === "string" || body.title === null)
      data.title = body.title;
    if (typeof body.body === "string") data.body = body.body;
    if (typeof body.type === "string") {
      if (body.type !== "text" && body.type !== "video") {
        return NextResponse.json(
          { error: "type must be 'text' or 'video'" },
          { status: 400 },
        );
      }
      data.type = body.type;
    }
    if (typeof body.order === "number") data.order = body.order;

    const block = await prisma.contentBlock.update({
      where: { id },
      data,
    });

    return NextResponse.json({ block });
  } catch (error) {
    console.error("Update block error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.contentBlock.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete block error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}