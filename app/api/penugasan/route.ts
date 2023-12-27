import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const reqBody = await request.json();

    // Extract relevant data from request body
    const { pengaduanIds, divisiId } = reqBody;

    // Ensure pengaduanIds is an array
    if (!Array.isArray(pengaduanIds)) {
      throw new Error('pengaduanIds must be an array');
    }

    // Check for unprocessed pengaduan
    const unprocessedPengaduan = await prisma.pengaduan.findMany({
      where: {
        id: {
          in: pengaduanIds,
        },
        is_processed: false,
      },
    });

    if (unprocessedPengaduan.length !== pengaduanIds.length) {
      throw new Error('Some pengaduan are already processed');
    }

    // Create penugasan
    const newPenugasan = await prisma.penugasan.create({
      data: { 
        divisi_id: divisiId,
      },
    });

    // Create penugasan_pengaduan relationships
    await prisma.penugasan_pengaduan.createMany({
      data: unprocessedPengaduan.map((pengaduan) => ({
        penugasan_id: newPenugasan.id,
        pengaduan_id: pengaduan.id,
      })),
    });

    // Mark pengaduan as processed
    await prisma.pengaduan.updateMany({
      where: {
        id: {
          in: pengaduanIds,
        },
      },
      data: { is_processed: true },
    });

    return NextResponse.json({ message: 'Success create penugasan', data: newPenugasan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create penugasan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {
    const prisma = new PrismaClient();
  
    try {
      const allPenugasan = await prisma.penugasan.findMany({
        include: {
          penugasan_pengaduan: {
            include: {
              pengaduan: {
                select: {
                  id: true,
                  nama: true,
                  no_telp: true,
                  keterangan: true,
                  is_processed: true,
                  processed_at: true,
                },
              },
            },
          },
        },
      });
  
      return NextResponse.json({ data: allPenugasan });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch penugasan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }