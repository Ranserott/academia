import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
// Enrollment model helper
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId, enrolledAt: new Date() }
  })
}
