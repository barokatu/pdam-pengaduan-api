export type ResultCodeType = {
    rescode: number,
    message: string,
}

export const resultCode = (code: number, message?: string) => {
    // untuk success request
    if(code === 200) {
        return {
            rescode: 200,
            message: "Success request "+ message,
        }
    }
    // untuk sukses create data
    else if(code === 201) {
        return {
            rescode: 201,
            message: "Success to create data "+ message
        }
    }
    // untuk pengaduan gagal ditugaskan dikarenakan sudah ditugaskan di salah satu pengaduan
    else if(code === 211) {
        return {
            rescode: 211,
            message: "Gagal menugaskan ke divisi, salah satu pengaduan sudah di tugaskan"
        }
    }
    // untuk error parameter month atau year tidak ditemukan ketika get
    else if(code === 212) {
        return {
            rescode: 212,
            message: "Gagal request, sertakan parameter month dan year"
        }
    }
    // untuk error petugas tidak ada
    else if(code === 213) {
        return {
            rescode: 213,
            message: "Gagal request, sertakan parameter petugasId untuk request ini" 
        }
    }
    // untuk error pengaduanId tidak ada
    else if(code === 214) {
        return {
            rescode: 214,
            message: "Gagal request, sertakan parameter pengaduanId untuk request ini"
        }
    }
}