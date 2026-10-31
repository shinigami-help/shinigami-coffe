// File proxy.js di root proyek (Next.js 16) — pengganti middleware.js.
// US-06 + aturan keamanan 4: semua rute /admin kecuali /admin/login hanya
// boleh dibuka admin yang sudah login (Supabase Auth + cookie sesi).
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ambilEnv, ambilUrlSupabase } from "@/lib/supabase/konfigurasi";

export default async function proxy(request) {
  const keHalamanLogin = request.nextUrl.pathname === "/admin/login";
  let jawaban = NextResponse.next({ request });

  let supabase;
  try {
    supabase = createServerClient(
      ambilUrlSupabase(),
      ambilEnv("SUPABASE_PUBLISHABLE_KEY"),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookieSet) {
            cookieSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            jawaban = NextResponse.next({ request });
            cookieSet.forEach(({ name, value, options }) =>
              jawaban.cookies.set(name, value, options)
            );
          },
        },
      }
    );
  } catch {
    // Env belum lengkap bentuk/ilang: halaman login tetap dibuka agar pesannya
    // jelas, halaman admin lain ditahan supaya tidak bocor (fail closed).
    if (keHalamanLogin) {
      return jawaban;
    }
    return new NextResponse(
      "Konfigurasi server belum lengkap untuk proteksi halaman admin.",
      { status: 503 }
    );
  }

  // getUser() memverifikasi token ke server Supabase, bukan sekadar membaca cookie.
  const { data } = await supabase.auth.getUser();

  if (!data?.user && !keHalamanLogin) {
    const tujuan = request.nextUrl.clone();
    tujuan.pathname = "/admin/login";
    return NextResponse.redirect(tujuan);
  }

  return jawaban;
}

export const config = {
  matcher: ["/admin/:path*"],
};