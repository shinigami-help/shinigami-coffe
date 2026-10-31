// Pembaca environment variable untuk koneksi Supabase di server.
// Nilai yang diterima dipakai apa adanya di produksi, jadi di sini diberi
// toleransi kecil untuk kesalahan tempel yang sering terjadi:
// - spasi di awal/akhir,
// - kutipan pembuka/penutup,
// - path/garis miring ekstra pada SUPABASE_URL (diubah ke origin).
// Isi variabel tidak pernah ditulis ke log supaya key tidak bocor.

export function ambilEnv(nama) {
  const nilai = String(process.env[nama] ?? "")
    .trim()
    .replace(/^["']+|["']+$/g, "");

  if (!nilai) {
    throw new Error(
      `${nama} belum diatur. Isi di .env.local (lokal) atau Settings > Environment Variables (Vercel).`
    );
  }

  return nilai;
}

// Supabase memanggil PostgREST dari origin, jadi path setelah host bisa aman
// dibuang. Pesan error sengaja tidak mencantumkan isi variabel karena pengguna
// kadang salah tempel key ke kolom URL.
export function ambilUrlSupabase() {
  const urlAsli = ambilEnv("SUPABASE_URL");

  let terurai;
  try {
    terurai = new URL(urlAsli);
  } catch {
    throw new Error(
      "SUPABASE_URL tidak valid. Isi persis seperti https://<project-ref>.supabase.co tanpa path."
    );
  }

  if (terurai.pathname && terurai.pathname !== "/") {
    console.warn(
      "SUPABASE_URL berisi path setelah host; aplikasi otomatis memakai origin saja. Sebaiknya isi tanpa garis miring: gunakan kolom Project URL di Supabase, bukan connection string/pooler."
    );
  }

  return terurai.origin;
}