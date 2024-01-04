import { resultCode } from '@/utils/rescode';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const prisma = new PrismaClient();
    console.log("Request on ", request.url)
  
    try {
      const urlSearchParams = new URLSearchParams(request.url);
      const pengaduanId = urlSearchParams.get('pengaduanId');
      if(pengaduanId === null) {
        return NextResponse.json({...resultCode(214)}, { status: 200 })
      }

      const allPengaduan = await prisma.pengaduan.findUnique({
        include: {
            jenis_aduan: true,
            petugas: true,
        },
        where: {
            id: parseInt(pengaduanId)
        },
      });
  
  
      return NextResponse.json({ data: allPengaduan });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  