import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-2026';
const WORKPLACE_LAT = parseFloat(process.env.NEXT_PUBLIC_WORKPLACE_LAT || '0.313092');
const WORKPLACE_LNG = parseFloat(process.env.NEXT_PUBLIC_WORKPLACE_LNG || '32.580910');
const RADIUS = parseFloat(process.env.NEXT_PUBLIC_WORKPLACE_RADIUS || '100');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    const { latitude, longitude, selfie, signOutAmount } = await req.json();

    if (signOutAmount > 20000 || signOutAmount <= 0) {
      return NextResponse.json({ error: 'Sign out amount must be between 1 and 20,000 UGX' }, { status: 400 });
    }

    // Geo check
    const distance = getDistanceFromLatLonInMeters(latitude, longitude, WORKPLACE_LAT, WORKPLACE_LNG);
    if (distance > RADIUS) {
      return NextResponse.json({ error: 'You are not at the workplace' }, { status: 400 });
    }

    const now = new Date();
    const hours = now.getHours();

    // Sign Out window: 20:00 - 23:30 EAT
    if (hours < 20 || (hours === 23 && now.getMinutes() > 30)) {
      return NextResponse.json({ error: 'Sign out only allowed between 8:00pm and 11:30pm EAT' }, { status: 400 });
    }

    const today = now.toISOString().split('T')[0];

    const attendance = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } }
    });

    if (!attendance || !attendance.signInTime) {
      return NextResponse.json({ error: 'You must sign in first today' }, { status: 400 });
    }

    if (attendance.signOutTime) {
      return NextResponse.json({ error: 'Already signed out today' }, { status: 400 });
    }

    // Update attendance and subtract from payable salary
    await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        signOutTime: now,
        signOutAmount,
        selfieUrl: selfie || attendance.selfieUrl,
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        payableSalary: { decrement: signOutAmount }
      }
    });

    return NextResponse.json({ 
      message: `Signed out successfully. Received UGX ${signOutAmount}` 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 });
  }
}

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
