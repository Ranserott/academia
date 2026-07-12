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

    if (typeof body.title === "string" && body.title.trim().length >= 3) {
      data.title = body.title.trim();
    }
    if (typeof body.description === "string" && body.description.trim().length >= 5) {
      data.description = body.description.trim();
    }
    if (typeof body.price === "number") {
      data.price = Math.max(0, Math.round(body.price));
    }
    if (typeof body.image === "string" || body.image === null) {
      data.image = body.image;
    }
    if (typeof body.published === "boolean") {
      data.published = body.published;
    }

    if (typeof body.slug === "string" && body.slug.trim().length > 0) {
      const slug = body.slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
      const conflict = await prisma.course.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) {
        return NextResponse.json(
          { error: `Ya existe otro curso con el slug "${slug}"` },
          { status: 409 },
        );
      }
      data.slug = slug;
    }

    const course = await prisma.course.update({ where: { id }, data });
    return NextResponse.json({ course });
  } catch (error) {
    console.error("Update course error:", error);
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
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}