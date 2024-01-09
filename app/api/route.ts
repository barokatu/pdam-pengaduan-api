import { NextResponse } from 'next/server';

export async function GET(request: Request) {

  return NextResponse.json({ app: "API PENGADUAN PDAM KOTA PROBOLINGGO", versi: "Versi 1.0" });
}