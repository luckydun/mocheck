import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-2026';

export async function POST(req: NextRequest) {
  try {
    const { employeeId, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { employeeId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid Employee ID or Password' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid Employee ID or Password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, employeeId: user.employeeId, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      role: user.role,
      employeeId: user.employeeId,
      firstName: user.firstName
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
