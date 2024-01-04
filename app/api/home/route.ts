import { resultCode } from '@/utils/rescode';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    // Get the selected period from the request (replace with your logic)
    
    const reqBody = await request.json();

    const { selectedPeriod } = reqBody;
    console.log("selectedPeriod", selectedPeriod)

    const startDate = new Date(selectedPeriod.year, selectedPeriod.month - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of month

    const homeData = await prisma.$transaction([
      // count jumlah aduan yang belum ditugasi
      prisma.pengaduan.count({
        where: {
          is_complete: false,
          is_processed: false,
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // count jumlah aduan yang sudah di tugaskan
      prisma.pengaduan.count({
        where: {
          is_complete: false,
          is_processed: true,
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // count jumlah aduan yang belum diselesaikan
      prisma.pengaduan.count({
        where: {
          is_complete: false,
          is_processed: false,
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      //count jumlah aduan yang sudah di selesaikan
      prisma.pengaduan.count({
        where: {
          is_complete: true,
          is_processed: true,
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]) as any;

    const returnedData = {
      pengaduanBelumDitugaskan: homeData[0],
      pengaduanDitugaskan: homeData[1],
      pengaduangBelumDiselesaikan: homeData[2],
      pengaduanDiselesaikan: homeData[3]
    }

    return NextResponse.json({...resultCode(200), data: returnedData}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}