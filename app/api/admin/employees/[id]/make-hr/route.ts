import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;   // ← This is the required fix for Next.js 15

    const updated = await prisma.user.update({
      where: { id },
      data: { role: 'HR' }
    });

    return NextResponse.json({ 
      message: 'Employee promoted to HR successfully', 
      employee: updated 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to make HR' }, { status: 500 });
  }
}
