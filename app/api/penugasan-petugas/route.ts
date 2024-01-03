import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firebaseConfig } from '@/config/firebase';
import { isIsoDate } from '@/utils/datevalidation';

const app = initializeApp(firebaseConfig);

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    
    const {petugasId, pengaduanId, tglTarget} = await request.json();

    if(isIsoDate(tglTarget)) {
        return NextResponse.json({
            message: 'Error, harus menggunakan ISO date time untuk tanggal target',
            error: 'Failed to eedit because the tglTarget not using ISO date time'
        },
        {status: 500})
    }

    const pengaduanData = await prisma.pengaduan.findUnique({
        where: {
            id: pengaduanId
        }
    })

    if(!pengaduanData) {
        return NextResponse.json({ 
            message: 'Error, pengaduan belum di proses, tidak bisa di selesaikan', 
            error: 'Failed to edit because the data not processed by administrator'}, 
            {status: 500}
        )
        
    }
    // Update pengaduan
    const updatedPengaduan = await prisma.pengaduan.update({
      where: { id: pengaduanId },
      data: {
        is_processed: true,
        processed_at: new Date(),
        tgl_target: tglTarget,
        updated_at: new Date(),
        petugas_id: petugasId
      },
    });

    return NextResponse.json({ message: 'Success update petugas pengaduan', data: updatedPengaduan }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update petugas pengaduan pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
