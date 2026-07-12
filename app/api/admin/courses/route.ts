import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `curso-${Date.now()}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, price, image, published } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "El título es obligatorio (mínimo 3 caracteres)" },
        { status: 400 },
      );
    }

    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json(
        { error: "La descripción es obligatoria (mínimo 5 caracteres)" },
        { status: 400 },
      );
    }

    const finalSlug =
      typeof slug === "string" && slug.trim().length > 0
        ? slugify(slug)
        : slugify(title);

    const existing = await prisma.course.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { error: `Ya existe un curso con el slug "${finalSlug}"` },
        { status: 409 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        description: description.trim(),
        price: typeof price === "number" ? Math.max(0, Math.round(price)) : 0,
        image: typeof image === "string" && image.trim() ? image.trim() : null,
        published: !!published,
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { modules: true, enrollments: true } } },
    });
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("List courses error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}