import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Create sample courses
    const courses = [
      {
        title: "Fundamentos de React",
        slug: "fundamentos-react",
        description: "Aprende los fundamentos de React desde cero. Componentes, props, state y más.",
        price: 0,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        published: true,
        lessons: {
          create: [
            { title: "Introducción a React", description: "Qué es React y por qué usarlo", order: 1 },
            { title: "Creando tu primer componente", description: "Aprende a crear componentes", order: 2 },
            { title: "Props y Estado", description: "Comunicación entre componentes", order: 3 },
            { title: "Manejo de eventos", description: "Eventos en React", order: 4 },
            { title: "Hook useState", description: "Estado en componentes funcionales", order: 5 },
          ],
        },
      },
      {
        title: "TypeScript para Principiantes",
        slug: "typescript-principiantes",
        description: "Domina TypeScript y mejora tu código JavaScript con tipos estáticos.",
        price: 0,
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
        published: true,
        lessons: {
          create: [
            { title: "¿Qué es TypeScript?", description: "Introducción y beneficios", order: 1 },
            { title: "Tipos básicos", description: "String, number, boolean", order: 2 },
            { title: "Interfaces y tipos", description: "Definiendo estructuras", order: 3 },
            { title: "Funciones tipadas", description: "TypeScript en funciones", order: 4 },
          ],
        },
      },
      {
        title: "Next.js 14 - Guía Completa",
        slug: "nextjs-14-completo",
        description: "Construye aplicaciones full-stack con Next.js 14 y el App Router.",
        price: 29900,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
        published: true,
        lessons: {
          create: [
            { title: "Introducción a Next.js 14", description: "Nuevas características del App Router", order: 1 },
            { title: "Creando tu primera página", description: "Pages y layouts", order: 2 },
            { title: "API Routes", description: "Creando endpoints API", order: 3 },
            { title: "Base de datos con Prisma", description: "Integrando Prisma ORM", order: 4 },
            { title: "Autenticación", description: "NextAuth.js实战", order: 5 },
          ],
        },
      },
      {
        title: "CSS Moderno y Tailwind",
        slug: "css-moderno-tailwind",
        description: "Diseña interfaces hermosas con CSS moderno y Tailwind CSS.",
        price: 19900,
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
        published: true,
        lessons: {
          create: [
            { title: "Fundamentos de CSS", description: "Selectores, propiedades y más", order: 1 },
            { title: "Flexbox y Grid", description: "Layouts modernos", order: 2 },
            { title: "Introducción a Tailwind", description: "Utility-first CSS", order: 3 },
            { title: "Componentes con Tailwind", description: "Creando UI reutilizable", order: 4 },
          ],
        },
      },
    ];

    // Create courses and lessons
    for (const courseData of courses) {
      const { lessons, ...courseInfo } = courseData;
      
      await prisma.course.upsert({
        where: { slug: courseInfo.slug },
        update: courseInfo,
        create: {
          ...courseInfo,
          lessons: lessons,
        },
      });
    }

    // Create admin user
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await prisma.user.upsert({
      where: { email: "admin@academia.cl" },
      update: {},
      create: {
        email: "admin@academia.cl",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      coursesCreated: courses.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        lessons: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
