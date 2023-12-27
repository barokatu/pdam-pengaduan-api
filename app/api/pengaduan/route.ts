import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const reqBody = await request.json();

    const {
      jenis_aduan_id,
      pelanggan_id,
      nama,
      no_identitas,
      alamat,
      no_telp,
      keterangan,
    } = reqBody;

    const nomor = `ADU17${Date.now()}`;
    const is_pelanggan = pelanggan_id ? true : false;

    const newPengaduan = await prisma.pengaduan.create({
      data: {
        nomor,
        jenis_aduan_id,
        pelanggan_id,
        is_pelanggan,
        nama,
        no_identitas,
        alamat,
        no_telp,
        keterangan,
      },
    });

    return NextResponse.json({ message: 'Success create pengaduan', data: newPengaduan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {
  const prisma = new PrismaClient();

  try {
    const allPengaduan = await prisma.pengaduan.findMany();

    return NextResponse.json({ data: allPengaduan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}