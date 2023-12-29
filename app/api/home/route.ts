import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const prisma = new PrismaClient();

  try {
    const homeData = await prisma.$transaction([
      prisma.pengaduan.count(),
      prisma.penugasan.count(),
      prisma.penugasan_pengaduan.count(),
      prisma.pengaduan.count({ where: { is_complete: true } }),
      prisma.pengaduan.count({ where: { is_complete: false } }),
      prisma.pengaduan.count({ where: { is_processed: true } }),
      prisma.pengaduan.count({ where: { is_processed: false } }),
    ]) as any;

    const homeDataObject = {
        jumlahPengaduan: homeData[0],
        jumlahPenugasan: homeData[1],
        jumlahPenugasanPengaduan: homeData[2],
        jumlahPengaduanSelesai: homeData[3],
        jumlahPengaduanBelumSelesai: homeData[4],
        jumlahPengaduanDitugaskan: homeData[5],
        jumlahPengaduanBelumDitugaskan: homeData[6]
    }
    
    console.log("home data", homeDataObject)

    return NextResponse.json({
        message: "success get home data",
        data: homeDataObject,
        status: 200
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}