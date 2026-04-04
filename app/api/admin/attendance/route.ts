import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const attendance = await prisma.attendance.findMany({
    where: {
      date: today,
      signInTime: { not: null }
    },
    include: {
      user: {
        select: {
          employeeId: true,
          firstName: true,
          lastName: true,
          role: true,
        }
      }
    },
    orderBy: { signInTime: 'asc' }
  });

  return NextResponse.json(attendance);
}
