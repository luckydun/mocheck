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

    const { latitude, longitude, selfie } = await req.json();

    // Geo check
    const distance = getDistanceFromLatLonInMeters(latitude, longitude, WORKPLACE_LAT, WORKPLACE_LNG);
    if (distance > RADIUS) {
      return NextResponse.json({ error: 'You are not at the workplace (Kampala office)' }, { status: 400 });
    }

    const now = new Date();
    const hours = now.getHours(); // EAT is UTC+3, but for simplicity we use local time (Vercel is close enough)

    // Sign In window: 5:00 - 12:00 EAT
    if (hours < 5 || hours >= 12) {
      return NextResponse.json({ error: 'Sign in only allowed between 5:00am and 12:00pm EAT' }, { status: 400 });
    }

    const today = now.toISOString().split('T')[0];

    // Check if already signed in today
    const existing = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } }
    });

    if (existing && existing.signInTime) {
      return NextResponse.json({ error: 'Already signed in today' }, { status: 400 });
    }

    const isLate = hours >= 10;
    const latePenalty = isLate ? 2000 : 0;

    await prisma.attendance.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        signInTime: now,
        selfieUrl: selfie,
        latitude,
        longitude,
        isLate,
      },
      create: {
        userId,
        date: today,
        signInTime: now,
        selfieUrl: selfie,
        latitude,
        longitude,
        isLate,
      }
    });

    // Apply late penalty
    if (isLate) {
      await prisma.user.update({
        where: { id: userId },
        data: { payableSalary: { decrement: 2000 } }
      });
    }

    return NextResponse.json({ message: isLate ? 'Signed in (late penalty applied)' : 'Signed in successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sign in failed' }, { status: 500 });
  }
}

// Haversine distance function
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
