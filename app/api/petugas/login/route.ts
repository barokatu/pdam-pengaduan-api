import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const { username, password } = await request.json();

    console.log("username: ", username, "\n passoword: ", password)

    // Find petugas with the given username
    const petugas = await prisma.petugas.findUnique({
      where: { username },
    });

    if (!petugas) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // Compare passwords using bcryptjs
    const isMatch = await bcrypt.compare(password, petugas.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to login' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
