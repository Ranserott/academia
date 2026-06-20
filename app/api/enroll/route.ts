import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });

    // Initialize progress for all lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: true },
    });

    if (course) {
      await prisma.progress.createMany({
        data: course.lessons.map((lesson) => ({
          userId: session.user.id,
          lessonId: lesson.id,
          completed: false,
        })),
      });
    }

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await prisma.progress.findMany({
          where: {
            userId: session.user.id,
            lessonId: { in: enrollment.course.lessons.map((l) => l.id) },
          },
        });

        const completedLessons = progress.filter((p) => p.completed).length;
        const totalLessons = enrollment.course.lessons.length;
        const progressPercentage =
          totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          ...enrollment,
          progress: progressPercentage,
          completedLessons,
          totalLessons,
        };
      })
    );

    return NextResponse.json(enrollmentsWithProgress);
  } catch (error) {
    console.error("Get enrollments error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
