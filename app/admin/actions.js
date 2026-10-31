"use server";

// US-04: aksi sesi admin — login dan keluar, semuanya diproses di server.
// Klien Supabase (lib/supabase/session) tidak pernah dibuat di browser.

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

export async function loginAdmin(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    return {
      error:
        "Gagal masuk: konfigurasi server belum lengkap. Periksa SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  let supabase;
  try {
    supabase = await createSessionClient();
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Gagal masuk: sesi tidak bisa disiapkan di server. Coba lagi.",
    };
  }

  let hasil;
  try {
    hasil = await supabase.auth.signInWithPassword({ email, password });
  } catch {
    return {
      error: "Gagal menghubungi server autentikasi. Periksa koneksi internet, lalu coba lagi.",
    };
  }

  if (hasil.error) {
    const salahKredensial =
      hasil.error.code === "invalid_credentials" || hasil.error.status === 400;
    return {
      error: salahKredensial
        ? "Email atau password salah. Coba lagi."
        : `Gagal masuk: ${hasil.error.message}. Coba lagi nanti.`,
    };
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Sesi mungkin sudah habis; tetap arahkan pengguna ke halaman login.
  }
  redirect("/admin/login");
}

// US-05: ganti password admin yang sedang login via Supabase Auth.
export async function gantiPassword(prevState, formData) {
  const passwordBaru = String(formData.get("password_baru") ?? "");
  const konfirmasiPassword = String(formData.get("konfirmasi_password") ?? "");

  // Aturan keamanan 3: verifikasi sesi admin di server sebelum mengubah data.
  let supabase;
  try {
    supabase = await createSessionClient();
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Gagal menyiapkan sesi di server. Coba lagi.",
    };
  }

  const { data: dataSesi, error: errorSesi } = await supabase.auth.getUser();
  if (errorSesi || !dataSesi?.user) {
    return {
      error: "Sesi berakhir. Masuk kembali sebagai admin, lalu coba lagi.",
    };
  }

  // Validasi di server: panjang minimal dan kesamaan konfirmasi.
  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }
  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: passwordBaru });
    if (error) {
      return { error: `Gagal mengganti password: ${error.message}. Coba lagi.` };
    }
  } catch {
    return {
      error: "Gagal menghubungi server autentikasi. Periksa koneksi internet, lalu coba lagi.",
    };
  }

  return { sukses: "Password berhasil diganti." };
}