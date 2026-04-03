import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { employeeId: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        employeeId: 'admin',
        firstName: 'System',
        lastName: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
        netSalary: 0,
        payableSalary: 0,
      }
    });

    return NextResponse.json({ 
      message: '✅ Default Admin created successfully!',
      credentials: {
        employeeId: 'admin',
        password: '123456'
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
