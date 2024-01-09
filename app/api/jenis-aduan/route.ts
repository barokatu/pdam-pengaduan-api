import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const prisma = new PrismaClient();

  try {
    const jenisAduan = await prisma.jenis_aduan.findMany();

    return NextResponse.json({ data: jenisAduan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch jenis penyelesaian' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}