import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const reqBody = await request.json();

    // Extract relevant data from request body
    const { divisi_id, username, password, nama, no_telp } = reqBody;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    // Create the petugas record
    const newPetugas = await prisma.petugas.create({
      data: {
        divisi_id,
        username,
        password: hashedPassword,
        nama,
        no_telp,
      },
    });

    return NextResponse.json({ message: 'Success create petugas', data: newPetugas }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create petugas' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}