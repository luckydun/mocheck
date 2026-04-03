import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const employees = await prisma.user.findMany({
    select: {
      id: true,
      employeeId: true,
      firstName: true,
      lastName: true,
      role: true,
      netSalary: true,
      payableSalary: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, employeeId, netSalary } = await req.json();

    const existing = await prisma.user.findUnique({ where: { employeeId } });
    if (existing) {
      return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash('123456', 10);

    const newEmployee = await prisma.user.create({
      data: {
        employeeId,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'EMPLOYEE',
        netSalary: Number(netSalary),
        payableSalary: Number(netSalary),
      }
    });

    return NextResponse.json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}
