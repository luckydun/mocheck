import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { firstName, lastName, employeeId, netSalary } = await req.json();

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        employeeId,
        netSalary: Number(netSalary),
        payableSalary: Number(netSalary),   // reset payable when net salary is updated by Admin
      }
    });

    return NextResponse.json({ message: 'Employee updated', employee: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Employee removed' });
