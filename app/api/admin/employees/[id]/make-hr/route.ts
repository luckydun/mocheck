import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role: 'HR' }
    });

    return NextResponse.json({ message: 'Employee promoted to HR', employee: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to make HR' }, { status: 500 });
  }
}
