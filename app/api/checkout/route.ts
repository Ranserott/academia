import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { courseId, userId } = await request.json()
  
  // Stripe/MercadoPago integration placeholder
  const session = {
    id: `session_${Date.now()}`,
    courseId,
    userId,
    status: 'pending'
  }
  
  return NextResponse.json({ sessionId: session.id })
}
