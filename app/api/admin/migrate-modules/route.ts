import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      include: { lessons: { orderBy: { order: "asc" } }, modules: true },
    });

    const results: Array<{
      courseId: string;
      courseTitle: string;
      modulesCreated: number;
      blocksCreated: number;
      skipped: boolean;
    }> = [];

    for (const course of courses) {
      if (course.modules.length > 0) {
        results.push({
          courseId: course.id,
          courseTitle: course.title,
          modulesCreated: 0,
          blocksCreated: 0,
          skipped: true,
        });
        continue;
      }

      if (course.lessons.length === 0) {
        results.push({
          courseId: course.id,
          courseTitle: course.title,
          modulesCreated: 0,
          blocksCreated: 0,
          skipped: false,
        });
        continue;
      }

      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: "Módulo 1: Introducción",
          description: "Contenido migrado del formato anterior.",
          order: 0,
        },
      });

      let blocksCreated = 0;
      for (const lesson of course.lessons) {
        const isVideo = !!lesson.videoUrl && lesson.videoUrl.trim().length > 0;
        await prisma.contentBlock.create({
          data: {
            moduleId: module.id,
            type: isVideo ? "video" : "text",
            title: lesson.title,
            body: isVideo
              ? lesson.videoUrl!
              : `${lesson.description ?? ""}${lesson.description ? "\n\n" : ""}Duración estimada: ${lesson.duration ?? 0}s`,
            order: lesson.order,
          },
        });
        blocksCreated += 1;
      }

      results.push({
        courseId: course.id,
        courseTitle: course.title,
        modulesCreated: 1,
        blocksCreated,
        skipped: false,
      });
    }

    return NextResponse.json({
      success: true,
      coursesProcessed: courses.length,
      results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", detail: String(error) },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: { select: { lessons: true, modules: true } },
        modules: { include: { _count: { select: { blocks: true } } } },
      },
    });

    return NextResponse.json({
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        lessons: c._count.lessons,
        modules: c._count.modules,
        blocks: c.modules.reduce((acc, m) => acc + m._count.blocks, 0),
        migrated: c._count.modules > 0,
      })),
    });
  } catch (error) {
    console.error("Migration status error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}