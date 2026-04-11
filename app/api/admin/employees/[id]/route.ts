import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firstName, lastName, employeeId, netSalary } = await req.json();

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        employeeId,
        netSalary: Number(netSalary),
        payableSalary: Number(netSalary),
      }
    });

    return NextResponse.json({ message: 'Employee updated successfully', employee: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prevent deleting Admin
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (userToDelete?.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot delete Admin account' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Employee removed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove employee' }, { status: 500 });
  }
}
