import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const prisma = new PrismaClient();

  try {
    const jenisPenyelesaian = await prisma.jenis_penyelesaian.findMany();

    return NextResponse.json({ data: jenisPenyelesaian });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch jenis penyelesaian' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}